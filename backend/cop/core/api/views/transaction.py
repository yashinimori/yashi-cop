from django_filters import rest_framework as django_filters
from rest_framework import filters
from rest_framework import viewsets

from cop.core.api.serializers.transaction import TransactionSerializer
from cop.core.models import Transaction


class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    queryset = Transaction.objects.all().order_by('id')
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, django_filters.DjangoFilterBackend]
    filterset_fields = (
        'bank__id',
        'bank__name_eng',
        'terminal__terminal_id',
        'merchant__merchant_name_legal',
        'merchant__merchant_id',
        'auth_code',
    )

    search_fields = [
        'id',
        'bank__name_eng',
        'terminal__terminal_id',
        'merchant__merchant_name_legal',
        'merchant__merchant_id',
        'pan',
        'trans_amount',
        'trans_currency',
        'auth_code',
        'approval_code',
        'cash_count',
        'error',
        'result',
    ]
