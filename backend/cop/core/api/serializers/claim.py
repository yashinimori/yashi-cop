from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers

from cop.core.models import Claim, Merchant, Terminal, ClaimDocument, Comment, ReasonCodeGroup, Bank, Report, \
    MEDIATION
from cop.core.utils.claim_reason_codes import ClaimReasonCodes as crc
from cop.core.utils.save_transaction_pdf import save_transaction_pdf
from cop.users.api.serializers.user import UserSerializer
User = get_user_model()


MASTERCARD_START_NUMBERS = [5, 6]
VISA_START_NUMBERS = [4]


class MerchantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Merchant
        fields = ('id', 'name_legal', 'name_ips')


class BankSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bank
        fields = (
            'id',
            'bin',
            'name_eng',
            'name_uk',
            'name_rus',
        )


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ('id', 'text', 'user', 'create_date', 'update_date')


class ReasonCodeGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReasonCodeGroup
        fields = ('id', 'code', 'visa', 'mastercard', 'description')
        read_only = ('id',)


class ClaimDocumentSerializer(serializers.ModelSerializer):

    class Meta:
        model = ClaimDocument
        fields = ('id', 'file', 'description', 'type', 'claim', 'user')

    def create(self, validated_data):
        validated_data['user'] = self.context["request"].user
        return super(ClaimDocumentSerializer, self).create(validated_data)

    def update(self, instance, validated_data):
        validated_data['user'] = self.context["request"].user
        return super(ClaimDocumentSerializer, self).update(instance, validated_data)


class ClaimDocumentReportsSerializer(ClaimDocumentSerializer):
    def create(self, validated_data):
        instance = super().create(validated_data)
        Report.objects.create(log=validated_data['file'], claim_document=instance)
        return instance


class ClaimSerializer(serializers.ModelSerializer):
    documents = ClaimDocumentSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True, required=False)
    claim_reason_code = serializers.CharField(source="claim_reason_code.code")
    user = UserSerializer(read_only=True)

    class Meta:
        model = Claim
        fields = (
            "id",
            "user",
            "pan",
            "merch_name_ips",
            "term_id",
            "merch_id",
            "merchant",
            "bank",
            "trans_amount",
            "trans_currency",
            "trans_approval_code",
            "comments",
            "answers",
            "documents",
            "claim_reason_code",
            "reason_code_group",
            "reason_code",
            "trans_date",
            "action_needed",
            "result",
            "due_date",
            "stage"
        )

    def create(self, validated_data):
        current_user = self.context["request"].user
        claim_reason_code = validated_data.pop('claim_reason_code', None)
        if claim_reason_code:
            validated_data['claim_reason_code'] = ReasonCodeGroup.objects.get(**claim_reason_code)

        validated_data['user'] = current_user
        instance = super().create(validated_data)
        self.instance = instance

        if 'merch_id' in validated_data:
            self.assign_by_merch_id(validated_data['merch_id'], instance)
        if 'term_id' in validated_data:
            self.assign_by_term_id(validated_data['term_id'], instance)

        self.assign_rc_by_claim_rc(instance, validated_data['claim_reason_code'])

        self.assign_bank_by_pan(instance)

        return instance

    def update(self, instance, validated_data):
        claim_reason_code = validated_data.pop('claim_reason_code', None)
        if claim_reason_code:
            validated_data['claim_reason_code'] = ReasonCodeGroup.objects.get(code=claim_reason_code)
        instance = super().update(instance, validated_data)
        return instance

    def assign_by_merch_id(self, merch_id, instance):
        merchant = Merchant.objects.filter(merch_id=merch_id).first()
        if merchant:
            instance.merchant = merchant
            # TODO: find bank by term/pan?
            instance.bank = merchant.bank.all().first()
            # TODO: decide which terminal to choose if there are multiple
            # terminal = get_object_or_404(Terminal, merchant=merchant)
            # instance.terminal = terminal
            instance.save()

    def assign_by_term_id(self, term_id, instance):
        terminal = Terminal.objects.filter(term_id=term_id).first()
        if terminal:
            instance.terminal = terminal
            instance.merchant = terminal.merchant
            instance.save()

    def assign_rc_by_claim_rc(self, instance, claim_reason_code):
        instance.reason_code_group = claim_reason_code.description

        if int(instance.pan[0]) in MASTERCARD_START_NUMBERS:
            instance.reason_code = claim_reason_code.mastercard
        elif int(instance.pan[0]) in VISA_START_NUMBERS:
            instance.reason_code = claim_reason_code.visa

        try:
            operations = crc.CLAIM_REASON_CODES[claim_reason_code.code]
            for operation in operations:
                operation(instance, claim_reason_code.code)
        except (KeyError, TypeError):
            pass

    def assign_bank_by_pan(self, instance):
        bank_bin = instance.pan[0:6]
        try:
            instance.bank = Bank.objects.get(bin=bank_bin)
            instance.save()
        except ObjectDoesNotExist:
            pass

    def assign_transaction(self):
        from cop.core.models import Transaction

        approval_code = self.instance.trans_approval_code
        qs = Transaction.objects.filter(pan__startswith=self.instance.pan[0:6], pan__endswith=self.instance.pan[-4:],
                                        trans_amount=self.instance.trans_amount, trans_date=self.instance.trans_date)
        if approval_code:
            qs.filter(approval_code=approval_code)
        transaction = qs.first()
        if transaction:
            self.transaction = transaction
            self.instance.transaction = transaction
            self.instance.result = transaction.result
            if self.instance.result == Transaction.Results.SUCCESSFUL:
                self.change_stage_add_comment()

    def change_stage_add_comment(self):
        self.instance.stage = MEDIATION
        media_path = save_transaction_pdf(self.transaction)
        system_user = User.objects.get(email='system@cop.cop')
        ClaimDocument.objects.create(
            type=ClaimDocument.Types.ATM_LOG,
            file=media_path,
            claim=self.instance,
            user=system_user
        )
        Comment.objects.create(
            text='згідно проведеного аналізу операція була завершена успішно, кошти були отримані',
            user=system_user,
            claim=self.instance
        )


class ClaimListSerializer(serializers.ModelSerializer):
    merchant = MerchantSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Claim
        fields = (
            "id",
            "user",
            "pan",
            "merchant",
            "merch_name_ips",
            "term_id",
            "due_date",
            "trans_approval_code",
            "trans_date",
            "trans_amount",
            "trans_currency",
            "reason_code_group",
            "reason_code",
            "action_needed",
            "result",
            "stage"
        )

