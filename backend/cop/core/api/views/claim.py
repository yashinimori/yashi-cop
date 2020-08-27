from django.contrib.auth import get_user_model
from django.http import HttpResponse
from django.template.loader import render_to_string
from django_filters import rest_framework as django_filters
from rest_framework import filters
from rest_framework import viewsets
from rest_framework.generics import CreateAPIView, get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from weasyprint import HTML

from cop.core.api.permissions.claim import HasMerchantClaimUpdatePermission
from cop.core.api.serializers.claim import ClaimSerializer, ClaimListSerializer, ClaimDocumentSerializer, \
    ClaimDocumentReportsSerializer
from cop.core.models import Claim, ClaimDocument, Status, ReasonCodeGroup, SurveyQuestion

User = get_user_model()


class ClaimViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, HasMerchantClaimUpdatePermission,)
    serializer_class = ClaimSerializer
    queryset = Claim.objects \
        .select_related('merchant', 'bank', 'transaction', 'user', 'claim_reason_code') \
        .order_by('id')
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
        qs = super().get_queryset()
        if current_user.is_chargeback_officer:
            employee_bank = current_user.bankemployee.bank
            qs = qs.filter(bank=employee_bank)
        elif current_user.is_cardholder:
            qs = qs.filter(user=current_user)
        elif current_user.is_merchant:
            qs = qs.filter(merchant=current_user.merchant) \
                .exclude(claim_reason_code__code=ReasonCodeGroup.ATM_CLAIM_CODE)
        elif not self.user_has_access():
            qs = Claim.objects.none()
        return qs

    def user_has_access(self):
        return self.request.user.role in (User.Roles.MERCHANT, User.Roles.CARDHOLDER, User.Roles.CHARGEBACK_OFFICER)

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


class ClaimFormToPDFView(APIView):
    template = 'claim/claim_form.html'
    queryset = Claim.objects.all()

    def get_object(self):
        return get_object_or_404(Claim, pk=self.kwargs.get('pk'))

    @staticmethod
    def get_claim_answers(claim):
        questions = SurveyQuestion.objects.all()
        answers = []
        for k, v in claim.answers.items():
            question_text = questions.get(pk=k).description
            answers.append({question_text: v})
        return answers

    def get_context_data(self):
        claim = self.get_object()
        answers = self.get_claim_answers(claim)
        return {
            'claim': claim,
            'answers': answers
        }

    def get(self, request, *args, **kwargs):
        html_string = render_to_string(self.template, self.get_context_data())
        html = HTML(string=html_string)
        pdf = html.write_pdf()
        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = 'inline; filename="claim.pdf"'
        return response
