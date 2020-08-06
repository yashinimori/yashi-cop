from rest_framework.routers import DefaultRouter

from cop.core.api.views.bank import BankViewSet
from cop.core.api.views.claim import ClaimViewSet
from cop.core.api.views.merchant import MerchantViewSet
from cop.core.api.views.terminal import TerminalViewSet

router = DefaultRouter()
router.register(r'banks', BankViewSet, basename='banks')
router.register(r'merchants', MerchantViewSet, basename='merchants')
router.register(r'terminals', TerminalViewSet, basename='terminals')
router.register(r'claims', ClaimViewSet, basename='claims')

urlpatterns = router.urls + [

]
