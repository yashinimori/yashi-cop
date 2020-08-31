from django_filters import rest_framework as django_filters
from rest_framework import filters
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from cop.core.api.permissions.base import ChargebackOfficerOnly
from cop.core.api.serializers.transaction import TransactionSerializer
from cop.core.models import Transaction


class TransactionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, ChargebackOfficerOnly]
    serializer_class = TransactionSerializer
    queryset = Transaction.objects.all().order_by('id')
    http_method_names = ['get', 'delete', 'head', 'options']
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, django_filters.DjangoFilterBackend]
    filterset_fields = (
        'bank__id',
        'bank__name_eng',
        'terminal__term_id',
        'merchant__name_legal',
        'merchant__merch_id',
        'pan',
        'trans_amount',
        'approval_code',
        'error',
        'result',
        'mcc',
        'trans_start',
        'trans_end',
        'pin_entered',
        'cash_request',
        'cash_presented',
        'cash_retracted',
        'cash_taken',
        'card_taken',
    )

    search_fields = [
        'id',
        'bank__name_eng',
        'terminal__term_id',
        'merchant__name_legal',
        'merchant__merch_id',
        'pan',
        'trans_amount',
        'approval_code',
        'cash_count',
        'error',
        'result',
        'mcc',
        'trans_start',
        'trans_end',
        'pin_entered',
        'cash_request',
        'cash_presented',
        'cash_retracted',
        'cash_taken',
        'card_taken',
    ]
