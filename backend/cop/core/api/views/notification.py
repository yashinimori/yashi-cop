from django_filters import rest_framework as django_filters
from rest_framework import filters
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from cop.core.api.serializers.notification import NotificationSerializer
from cop.core.models import Notification


class NotificationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer
    queryset = Notification.objects.all().order_by('id')
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, django_filters.DjangoFilterBackend]
    filterset_fields = (
        'id',
        'claim',
        'text',
        'is_active'
    )
    search_fields = [
        'id',
        'claim',
        'text',
        'is_active'
    ]
