from django_filters import rest_framework as django_filters
from rest_framework import filters
from rest_framework import viewsets

from cop.core.api.serializers.transaction import TransactionSerializer
from cop.core.models import Transaction


class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    queryset = Transaction.objects.all().order_by('id')
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, django_filters.DjangoFilterBackend]

    search_fields = [
        'id',
        'bank',
        'terminal',
        'merchant',
        'pan',
        'auth_code',
        'approval_code',
        'cash_count',
        'error',
        'result',
    ]
