from django_filters import rest_framework as django_filters
from rest_framework import filters
from rest_framework import viewsets

from cop.core.api.serializers.claim import ClaimSerializer
from cop.core.models import Claim


class ClaimViewSet(viewsets.ModelViewSet):
    serializer_class = ClaimSerializer
    queryset = Claim.objects.select_related('merchant', 'bank', 'transaction', 'stage').order_by('id')
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, django_filters.DjangoFilterBackend]

    search_fields = [
        'terminal_id',
        'merchant',
    ]
