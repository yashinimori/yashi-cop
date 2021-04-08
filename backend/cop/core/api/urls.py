from django.urls import path
from rest_framework.routers import DefaultRouter

from cop.core.api.views.atm import ATMViewSet
from cop.core.api.views.bank import BankViewSet
from cop.core.api.views.bin import BinViewSet
from cop.core.api.views.notification import NotificationViewSet, NotificationManagerView
from cop.core.api.views.bank_employee import BankEmployeeList, BankEmployeeRetrieveUpdate
from cop.core.api.views.claim import ClaimFormToPDFView, ClaimTimelineView
from cop.core.api.views.claim import ClaimViewSet, ClaimDocumentCreateView, ClaimDocumentReportsCreateView
from cop.core.api.views.comment import CommentCreateView
from cop.core.api.views.merchant import MerchantViewSet
from cop.core.api.views.reason_codes import ReasonCodeListAPIView
from cop.core.api.views.report import ReportCreateCreateView
from cop.core.api.views.stage_history import StageHistoryView
from cop.core.api.views.statistic import BankStats, BankUpdatedClaimsStatistics, ClaimsStatistics, \
    UpdatedClaimsStatistics, ClaimsStatisticsByStatusStage, ClaimsStatisticsByRcGroup, ClaimsStatisticsBySupportChoices
from cop.core.api.views.surveyquestion import SurveyQuestionViewSet
from cop.core.api.views.terminal import TerminalViewSet
from cop.core.api.views.transaction import TransactionViewSet

router = DefaultRouter()
router.register(r'banks', BankViewSet, basename='banks')
router.register(r'bins', BinViewSet, basename='bins')
router.register(r'notifications', NotificationViewSet, basename='notificationss')
router.register(r'merchants', MerchantViewSet, basename='merchants')
router.register(r'atms', ATMViewSet, basename='atms')
router.register(r'terminals', TerminalViewSet, basename='terminals')
router.register(r'transactions', TransactionViewSet, basename='transactions')
router.register(r'claims', ClaimViewSet, basename='claims')
router.register(r'references/survey-questions', SurveyQuestionViewSet, basename='survey-questions')


urlpatterns = router.urls + [
    path('claim-documents/atm-logs', ClaimDocumentReportsCreateView.as_view()),
    path('claim-documents/', ClaimDocumentCreateView.as_view()),
    path('atm-logs/', ReportCreateCreateView.as_view()),
    path('claim/<pk>/stage-history/', StageHistoryView.as_view()),
    path('claim/<pk>/comments/', CommentCreateView.as_view()),
    path('claim/<pk>/timeline/', ClaimTimelineView.as_view()),
    path('bank-employees/', BankEmployeeList.as_view()),
    path('bank-employees/<pk>/', BankEmployeeRetrieveUpdate.as_view()),
    path('claim/<pk>/pdf/', ClaimFormToPDFView.as_view()),
    path('reason-codes/', ReasonCodeListAPIView.as_view()),
    path('bank/<pk>/stats/updated-claims/', BankUpdatedClaimsStatistics.as_view()),
    path('bank/<pk>/stats/', BankStats.as_view()),
    path('stats/updated-claims/', UpdatedClaimsStatistics.as_view()),
    path('stats/', ClaimsStatistics.as_view()),
    path('stats/by-status-stages/', ClaimsStatisticsByStatusStage.as_view()),
    path('stats/by-rc-group/', ClaimsStatisticsByRcGroup.as_view()),
    path('stats/by-support/', ClaimsStatisticsBySupportChoices.as_view()),
    path('notifications/manager', NotificationManagerView.as_view()),
]
