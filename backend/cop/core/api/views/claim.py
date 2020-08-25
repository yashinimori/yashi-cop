from django_filters import rest_framework as django_filters
from rest_framework import filters
from rest_framework import viewsets
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from cop.core.api.serializers.claim import ClaimSerializer, ClaimListSerializer, ClaimDocumentSerializer, \
    ClaimDocumentReportsSerializer
from cop.core.models import Claim, ClaimDocument, Merchant, Status
from cop.users.models import User


class ClaimViewSet(viewsets.ModelViewSet):
    serializer_class = ClaimSerializer
    queryset = Claim.objects.select_related('merchant', 'bank', 'transaction'
                                            ).order_by('id')
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
        "documents",
        "claim_reason_code",
        "reason_code_group",
        "reason_code",
        "trans_date",
        "action_needed",
        "result",
        "due_date",
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
        "documents",
        "claim_reason_code",
        "reason_code_group",
        "reason_code",
        "trans_date",
        "action_needed",
        "result",
        "due_date",
    ]

    def get_queryset(self):
        current_user = self.request.user
        queryset = Claim.objects \
            .select_related('merchant', 'bank', 'transaction', 'user') \
            .order_by('id')
        if current_user.role == User.Roles.CHARGEBACK_OFFICER:
            bank_employee = current_user.bankemployee
            return queryset.filter(merchant__bank=bank_employee.bank)
        elif current_user.role == User.Roles.CARDHOLDER:
            return queryset.filter(user=current_user,
                                   status__stage__in=[Status.Stages.PRE_MEDIATION, Status.Stages.MEDIATION])
        elif current_user.role == User.Roles.MERCHANT:
            merchant = Merchant.objects.get(user=current_user)
            return queryset.filter(merchant=merchant)
        elif current_user.role == User.Roles.COP_MANAGER:
            return queryset
        else:
            return Claim.objects.none()

    def get_serializer_class(self):
        if self.action == 'list':
            return ClaimListSerializer
        return ClaimSerializer


class ClaimDocumentCreateView(CreateAPIView):
    serializer_class = ClaimDocumentSerializer
    queryset = ClaimDocument.objects.all()


class ClaimDocumentReportsCreateView(ClaimDocumentCreateView):
    serializer_class = ClaimDocumentReportsSerializer


class ClaimsStatistics(APIView):
    def get(self, request):

        last_login = self.request.user.last_login

        new_claims = Claim.objects.filter(chargeback_officer=None).count()
        in_prgress_claims = Claim.objects.filter(stage=Status.Stages.MEDIATION, chargeback_officer__isnull=False).count()
        completed_claims = Claim.objects.filter(stage=Status.Stages.FINAL_RULING, chargeback_officer__isnull=False).count()
        my_claims = Claim.objects.filter(chargeback_officer=self.request.user).count()
        all_claims = Claim.objects.count()
        new_received_claims_qs = Claim.objects.filter(create_date__gt=last_login)

        pre_mediation_claims = Claim.objects.filter(stage=Status.Stages.PRE_MEDIATION).count()
        mediation_claims = Claim.objects.filter(stage=Status.Stages.MEDIATION).count()
        chargeback_claims = Claim.objects.filter(stage=Status.Stages.CHARGEBACK).count()
        chargeback_escalation_claims = Claim.objects.filter(stage=Status.Stages.CHARGEBACK_ESCALATION).count()
        dispute_claims = Claim.objects.filter(stage=Status.Stages.DISPUTE).count()
        dispute_response_claims = Claim.objects.filter(stage=Status.Stages.DISPUTE_RESPONSE).count()
        pre_arbitration_claims = Claim.objects.filter(stage=Status.Stages.PRE_ARBITRATION).count()
        pre_arbitration_response_claims = Claim.objects.filter(stage=Status.Stages.PRE_ARBITRATION_RESPONSE).count()
        arbitration_response_claims = Claim.objects.filter(stage=Status.Stages.ARBITRATION).count()
        final_ruling_claims = Claim.objects.filter(stage=Status.Stages.FINAL_RULING).count()

        serializer = ClaimListSerializer(new_received_claims_qs, many=True)
        new_received_claims = serializer.data

        data = {
            'new_claims': new_claims,
            'in_prgress_claims': in_prgress_claims,
            'completed_claims': completed_claims,
            'my_claims': my_claims,
            'all_claims': all_claims,
            'pre_mediation_claims': pre_mediation_claims,
            'mediation_claims': mediation_claims,
            'chargeback_claims': chargeback_claims,
            'chargeback_escalation_claims': chargeback_escalation_claims,
            'dispute_claims': dispute_claims,
            'dispute_response_claims': dispute_response_claims,
            'pre_arbitration_claims': pre_arbitration_claims,
            'pre_arbitration_response_claims': pre_arbitration_response_claims,
            'arbitration_response_claims': arbitration_response_claims,
            'final_ruling_claims': final_ruling_claims,
            'new_received_claims': new_received_claims
        }

        return Response(data)

