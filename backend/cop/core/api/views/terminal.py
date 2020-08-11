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
        'merchant__name_legal',
        'merchant__merch_id',
    )

    search_fields = [
        'term_id',
        'merchant__name_legal',
        'merchant__merch_id',
    ]
