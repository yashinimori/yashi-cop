from itertools import chain

from django.contrib.auth import get_user_model
from django.http import HttpResponse
from django.template.loader import render_to_string
from django_filters import rest_framework as django_filters
from rest_framework import filters
from rest_framework import viewsets
from rest_framework.generics import CreateAPIView, get_object_or_404, ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from weasyprint import HTML

from cop.core.api.permissions.claim import HasMerchantClaimUpdatePermission
from cop.core.api.serializers.claim import ClaimSerializer, ClaimListSerializer, ClaimDocumentSerializer, \
    ClaimDocumentReportsSerializer, ClaimDocumentNestedSerializer, ClaimRetrieveSerializer
from cop.core.api.serializers.comment import CommentListSerializer
from cop.core.api.serializers.stage_history import StageHistorySerializerLite
from cop.core.models import Claim, ClaimDocument, ReasonCodeGroup, SurveyQuestion, Comment, StageChangesHistory

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
        "comments",
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
        elif current_user.is_cc_branch:
            qs = qs.filter(user=current_user)
        elif current_user.is_merchant:
            qs = qs.filter(merchant=current_user.merchant) \
                .exclude(claim_reason_code__code=ReasonCodeGroup.ATM_CLAIM_CODE)
        elif not self.user_has_access():
            qs = Claim.objects.none()
        return qs

    def user_has_access(self):
        return self.request.user.role in (User.Roles.MERCHANT, User.Roles.CARDHOLDER, User.Roles.CHARGEBACK_OFFICER, User.Roles.CC_BRANCH)

    def get_serializer_class(self):
        if self.action == 'list':
            return ClaimListSerializer
        if self.action == 'retrieve':
            return ClaimRetrieveSerializer
        return ClaimSerializer


class ClaimDocumentCreateView(CreateAPIView):
    serializer_class = ClaimDocumentSerializer
    queryset = ClaimDocument.objects.all()


class ClaimDocumentReportsCreateView(ClaimDocumentCreateView):
    serializer_class = ClaimDocumentReportsSerializer


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


class ClaimTimelineView(APIView):

    def get(self, request, pk):
        return Response(data=self.get_queryset())

    def get_queryset(self):
        pk = self.kwargs['pk']
        comments = Comment.objects.filter(claim__pk=pk)
        documents = ClaimDocument.objects.filter(claim__pk=pk)
        stage_changes = StageChangesHistory.objects.filter(claim__pk=pk)

        # Create an iterator for the querysets and turn it into a list.
        results_list = list(chain(comments, documents, stage_changes))
        # Optionally filter based on date, score, etc.
        sorted_list = sorted(results_list, key=lambda instance: instance.create_date, reverse=True)

        # Build the list with items based on the FeedItemSerializer fields
        results = list()
        for entry in sorted_list:
            item_type = entry.__class__.__name__.lower()
            if isinstance(entry, Comment):
                serializer = CommentListSerializer(entry)
            if isinstance(entry, ClaimDocument):
                serializer = ClaimDocumentNestedSerializer(entry)
            if isinstance(entry, StageChangesHistory):
                serializer = StageHistorySerializerLite(entry)

            results.append({'item_type': item_type, 'data': serializer.data})

        return results
