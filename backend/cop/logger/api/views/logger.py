from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ReadOnlyModelViewSet
from django_filters import rest_framework as django_filters
from rest_framework import filters

from cop.core.api.permissions.base import AllowSecurityOfficerPermission
from cop.logger.api.serializers.logger import LoggerEntrySerializer
from cop.logger.models import LoggerEntry


class LoggerListRetrieveView(ReadOnlyModelViewSet):
    serializer_class = LoggerEntrySerializer
    queryset = LoggerEntry.objects.all().order_by('-action_time')
    permission_classes = (IsAuthenticated, AllowSecurityOfficerPermission,)

    filter_backends = [filters.SearchFilter, filters.OrderingFilter, django_filters.DjangoFilterBackend]
    filterset_fields = (
        'action_time',
        'user',
        'content_type',
        'object_id',
        'object_repr',
        'action_flag',
        'change_message',
        'ip',
    )
    search_fields = [
        'id',
        'action_time',
        'user',
        'content_type',
        'object_id',
        'object_repr',
        'action_flag',
        'change_message',
        'ip',
    ]
