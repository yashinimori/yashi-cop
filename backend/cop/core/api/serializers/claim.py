from datetime import timedelta

from django.contrib.auth import get_user_model
from django_celery_beat.utils import now
from rest_framework import serializers

from cop.core.tasks import send_file_expiration_notification, delete_expired_files, delete_expired_report_files
from cop.core.models import Claim, Merchant, ClaimDocument, Comment, ReasonCodeGroup, Bank, Report, Status
from cop.core.services.claim_routing_service import ClaimRoutingService
from cop.core.services.status_service import StatusService, AllocationStatusService, CardholderStatusService
from cop.users.api.serializers.user import UserSerializer, UserSerializerLight

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
        fields = ('id', 'file', 'description', 'type', 'claim', 'user', 'create_date')
        read_only_fields = ('user', )

    def create(self, validated_data):
        validated_data['user'] = self.context["request"].user
        self.instance = super(ClaimDocumentSerializer, self).create(validated_data)
        self.create_tasks()
        return self.instance

    def update(self, instance, validated_data):
        validated_data['user'] = self.context["request"].user
        return super(ClaimDocumentSerializer, self).update(instance, validated_data)

    def create_tasks(self):
        if self.instance.type == ClaimDocument.Types.ATM_LOG:
            self.create_log_tasks()
        else:
            self.create_file_tasks()

    def create_log_tasks(self):
        in_120_days = now() + timedelta(days=120)
        delete_expired_files.apply_async((self.instance.id,), eta=in_120_days)

    def create_file_tasks(self):
        in_90_days = now() + timedelta(days=90)
        in_97_days = now() + timedelta(days=97)
        send_file_expiration_notification.apply_async((self.instance.id,), eta=in_90_days)
        delete_expired_files.apply_async((self.instance.id,), eta=in_97_days)


class ClaimDocumentNestedSerializer(serializers.ModelSerializer):
    user = UserSerializerLight()

    class Meta:
        model = ClaimDocument
        fields = ('id', 'file', 'description', 'type', 'user', 'create_date')


class ClaimDocumentReportsSerializer(ClaimDocumentSerializer):
    def create(self, validated_data):
        instance = super().create(validated_data)
        Report.objects.create(log=validated_data['file'], claim_document=instance)
        in_120_days = now() + timedelta(days=120)
        delete_expired_report_files.apply_async((self.instance.id,), eta=in_120_days)
        return instance


class ClaimSerializer(serializers.ModelSerializer):
    documents = ClaimDocumentSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True, required=False)
    bank = BankSerializer(read_only=True, required=False)
    status = StatusSerializer(read_only=True, required=False)
    claim_reason_code = serializers.CharField(source="claim_reason_code.code")
    user = UserSerializer(read_only=True)
    merchant = MerchantSerializer(read_only=True)

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
            "atm",
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
            "officer_answer_reason",
            "chargeback_date",
            "second_presentment_date",
            "arn"
        )

    def create(self, validated_data):
        validated_data = self.update_initial_data(validated_data)
        instance = super().create(validated_data)
        cmr = ClaimRoutingService(claim=instance, **validated_data)
        self.instance = cmr.claim
        self.set_status(is_created=True)
        return instance

    def update(self, instance, validated_data):
        claim_reason_code = validated_data.pop('claim_reason_code', None)
        instance = super().update(instance, validated_data)
        self.instance = instance
        self.set_status()
        return instance

    def set_status(self, is_created=False):
        claim = self.instance
        allocation_rc = ['0017', '0018', '0019', '0020', '0021', '0022', '0023', '0024']
        service_data = {'claim': claim, 'user': self.context["request"].user, 'is_created': is_created}
        service = None
        claim.action_needed = True
        if claim.claim_reason_code in allocation_rc:
            service = AllocationStatusService
        elif claim.bank and claim.merchant:
            service = StatusService
        elif not claim.bank and not claim.merchant:
            claim.action_needed = False
            service = CardholderStatusService
        self.start_service(service, **service_data)

    def start_service(self, service, **kwargs):
        if service:
            service(**kwargs)

    def update_initial_data(self, validated_data):
        validated_data['user'] = self.context["request"].user
        crc_instance = self.get_crc(validated_data)
        validated_data['claim_reason_code'] = crc_instance
        validated_data['status'] = self.get_initial_status(crc_instance.code)
        return validated_data

    def get_crc(self, validated_data):
        """Update claim_reason_code. """
        claim_reason_code = validated_data['claim_reason_code']
        return ReasonCodeGroup.objects.get(code=claim_reason_code['code'])

    @staticmethod
    def get_initial_status(crc_code: str):
        docs_request_rc = '0100'
        if crc_code == docs_request_rc:
            return Status.objects.get(index=2)
        return Status.objects.get(index=6)


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
            "status",
            "create_date",
        )
