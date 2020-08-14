from rest_framework.routers import DefaultRouter

from cop.core.api.views.bank import BankViewSet
from cop.core.api.views.claim import ClaimViewSet, ClaimDocumentViewSet, ClaimDocumentReportsViewSet
from cop.core.api.views.merchant import MerchantViewSet
from cop.core.api.views.surveyquestion import SurveyQuestionViewSet
from cop.core.api.views.terminal import TerminalViewSet
from cop.core.api.views.transaction import TransactionViewSet

router = DefaultRouter()
router.register(r'banks', BankViewSet, basename='banks')
router.register(r'merchants', MerchantViewSet, basename='merchants')
router.register(r'terminals', TerminalViewSet, basename='terminals')
router.register(r'transactions', TransactionViewSet, basename='transactions')
router.register(r'claims', ClaimViewSet, basename='claims')
router.register(r'claim-documents/reports', ClaimDocumentReportsViewSet, basename='claim-documents-reports')
router.register(r'claim-documents', ClaimDocumentViewSet, basename='claim-documents')
router.register(r'references/survey-questions', SurveyQuestionViewSet, basename='survey-questions')


urlpatterns = router.urls + [

]
