from django_filters import rest_framework as django_filters
from rest_framework import filters
from rest_framework import viewsets

from cop.core.api.serializers.claim import ClaimSerializer
from cop.core.models import Claim


class ClaimViewSet(viewsets.ModelViewSet):
    serializer_class = ClaimSerializer
    queryset = Claim.objects.select_related('merchant', 'bank', 'transaction', 'stage').order_by('id')
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, django_filters.DjangoFilterBackend]
    filterset_fields = (
        'user__email',
        'mediator__email',
        'source',
        'term_id',
        'merch_id',
        'reason_code',
        'bank__id',
        'bank__name_eng',
        'merchant__name_legal',
        'due_date',
        'dispute_date',
    )

    search_fields = [
        'user__first_name',
        'user__last_name',
        'mediator__first_name',
        'mediator__last_name',
        'email',
        'telephone',
        'source',
        'arn',
        'flag',
        'term_id',
        'merch_id',
        'merchant__name_legal',
        'merchant__merch_id',
        'bank__name_eng',
        'pan',
        'reason_code',
    ]
