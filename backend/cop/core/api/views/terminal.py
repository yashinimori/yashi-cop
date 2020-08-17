from django_filters import rest_framework as django_filters
from rest_framework import filters
from rest_framework import viewsets

from cop.core.api.serializers.terminal import TerminalSerializer
from cop.core.models import Terminal


class TerminalViewSet(viewsets.ModelViewSet):
    serializer_class = TerminalSerializer
    queryset = Terminal.objects.all().order_by('id')
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, django_filters.DjangoFilterBackend]
    filterset_fields = (
        'id',
        'term_id',
        'address',
        'merchant__name_ips',
        'merchant__merch_id',
        'merchant__id',
    )

    search_fields = [
        'id',
        'term_id',
        'address',
        'merchant__name_ips',
        'merchant__merch_id',
        'merchant__id',
    ]
