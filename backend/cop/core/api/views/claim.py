from django_filters import rest_framework as django_filters
from rest_framework import filters
from rest_framework import viewsets
from rest_framework.generics import CreateAPIView

from cop.core.api.serializers.claim import ClaimSerializer, ClaimListSerializer, ClaimDocumentSerializer, \
    ClaimDocumentReportsSerializer
from cop.core.models import Claim, ClaimDocument, Merchant
from cop.core.utils.custom_errors import RoleNotFound
from cop.users.models import User


class ClaimViewSet(viewsets.ModelViewSet):
    serializer_class = ClaimSerializer
    queryset = Claim.objects.select_related('merchant', 'bank', 'transaction'
                                            ).prefetch_related('ch_comments').order_by('id')
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, django_filters.DjangoFilterBackend]
    filterset_fields = (
        "id",
        "user",
        "pan",
        "merch_name_ips",
        "term_id",
        "merch_id",
        "trans_amount",
        "trans_currency",
        "trans_approval_code",
        "ch_comments",
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

    search_fields = [
        "id",
        "user",
        "pan",
        "merch_name_ips",
        "term_id",
        "merch_id",
        "trans_amount",
        "trans_currency",
        "trans_approval_code",
        "ch_comments",
        "documents",
        "claim_reason_code",
        "reason_code_group",
        "reason_code",
        "trans_date",
        "action_needed",
        "result",
        "due_date",
        "stage"
    ]

    def get_queryset(self):
        current_user = self.request.user
        queryset = Claim.objects \
            .select_related('merchant', 'bank', 'transaction') \
            .prefetch_related('ch_comments') \
            .order_by('id')
        if current_user.role == User.CHARGEBACK_OFFICER:
            bank_employee = current_user.bankemployee
            return queryset.filter(merchant__bank=bank_employee.bank)
        elif current_user.role == User.CARDHOLDER:
            return queryset.filter(user=current_user)
        elif current_user.role == User.MERCHANT:
            merchant = Merchant.objects.get(user=current_user)
            return queryset.filter(merchant=merchant)
        elif current_user.role == User.TOP_LEVEL:
            return queryset
        else:
            raise RoleNotFound

    def get_serializer_class(self):
        if self.action == 'list':
            return ClaimListSerializer
        return ClaimSerializer


class ClaimDocumentCreateView(CreateAPIView):
    serializer_class = ClaimDocumentSerializer
    queryset = ClaimDocument.objects.all()


class ClaimDocumentReportsCreateView(ClaimDocumentCreateView):
    serializer_class = ClaimDocumentReportsSerializer
