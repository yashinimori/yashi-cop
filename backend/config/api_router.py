from django.conf import settings
from django.urls import path, include
from rest_framework.routers import DefaultRouter, SimpleRouter


if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()

core_routes = path("", include("cop.core.api.urls")),


urlpatterns = router.urls
urlpatterns += core_routes
