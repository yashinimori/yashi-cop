from rest_framework.routers import DefaultRouter

from cop.logger.api.views.logger import LoggerListRetrieveView

router = DefaultRouter()
router.register(r'logger', LoggerListRetrieveView, basename='logs')

urlpatterns = router.urls
