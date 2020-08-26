from django.contrib.auth import get_user_model
from rest_framework import serializers

from cop.core.models import Claim, Merchant, ClaimDocument, Comment, ReasonCodeGroup, Bank, Report, Status
from cop.core.services.claim_routing_service import ClaimRoutingService
from cop.core.services.status_service import StatusService, AllocationStatusService, CardholderStatuses
from cop.users.api.serializers.user import UserSerializer

User = get_user_model()


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


class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = (
            'id',
            'index',
            'name',
            'stage',
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
        read_only_fields = ('user', )

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
    bank = BankSerializer(read_only=True, required=False)
    status = StatusSerializer(read_only=True, required=False)
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
            "issuer_mmt",
            "form_name",
            "status",
            "officer_answer_reason"
        )

    def create(self, validated_data):
        current_user = self.context["request"].user
        claim_reason_code = validated_data.pop('claim_reason_code', None)
        if claim_reason_code:
            validated_data['claim_reason_code'] = ReasonCodeGroup.objects.get(code=claim_reason_code['code'])
            validated_data['status'] = Status.objects.get(pk=1)
        validated_data['user'] = current_user
        instance = super().create(validated_data)
        cmr = ClaimRoutingService(claim=instance, **validated_data)
        self.instance = cmr.claim
        self.set_status()
        return instance

    def update(self, instance, validated_data):
        claim_reason_code = validated_data.pop('claim_reason_code', None)
        if claim_reason_code:
            validated_data['claim_reason_code'] = ReasonCodeGroup.objects.get(code=claim_reason_code['code'])
        instance = super().update(instance, validated_data)
        self.instance = instance
        self.set_status()
        return instance

    def set_status(self, status_index=None):
        claim = self.instance
        allocation_rc = ['0017', '0018', '0019', '0020', '0021', '0022', '0023', '0024']
        docs_request_rc = '0100'
        if claim.transaction or claim.claim_reason_code.code != docs_request_rc:
            mediation_escalation_status = 5
            status_index = mediation_escalation_status
            # TODO: can be removed after all status services are finished
            claim.status = Status.objects.get(index=status_index)
            claim.save()
        if claim.claim_reason_code in allocation_rc:
            AllocationStatusService(claim=claim, user=self.context["request"].user, status_index=status_index)
        elif claim.bank and claim.merchant:
            StatusService(claim=claim, user=self.context["request"].user, status_index=status_index)
        elif not claim.bank and not claim.merchant:
            CardholderStatuses(claim=claim, user=self.context["request"].user, status_index=status_index)


class ClaimListSerializer(serializers.ModelSerializer):
    merchant = MerchantSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    status = StatusSerializer(read_only=True)

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
            "status"
        )

