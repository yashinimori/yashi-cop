from django_filters import rest_framework as django_filters
from rest_framework import filters
from rest_framework import viewsets

from cop.core.api.serializers.claim import ClaimSerializer, ClaimListSerializer, ClaimDocumentSerializer
from cop.core.models import Claim, ClaimDocument


class ClaimViewSet(viewsets.ModelViewSet):
    serializer_class = ClaimSerializer
    queryset = Claim.objects.select_related('merchant', 'bank', 'transaction'
                                            ).prefetch_related('ch_comments').order_by('id')
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, django_filters.DjangoFilterBackend]
    filterset_fields = (
        'source',
        'term_id',
        'merch_id',
        'reason_code',
        'bank__id',
        'bank__name_eng',
        'merchant__name_legal',
        'due_date',
        'dispute_date',
        'action_needed',
    )

    search_fields = [
        'source',
        'arn',
        'flag',
        'term_id',
        'merch_id',
        'merchant__name_ips',
        'merchant__merch_id',
        'pan',
        'reason_code',
        'merch_name_ips',
        'trans_date',
        'trans_amount',
        'trans_currency',
        'action_needed',
        'stage'
    ]

    def get_serializer_class(self):
        if self.action == 'list':
            return ClaimListSerializer
        return ClaimSerializer


class ClaimDocumentViewSet(viewsets.ModelViewSet):
    serializer_class = ClaimDocumentSerializer
    queryset = ClaimDocument.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, django_filters.DjangoFilterBackend]
    filterset_fields = (
        'id',
        'type',
        'description'
    )
    search_fields = ['description', 'type', 'claim_id']
