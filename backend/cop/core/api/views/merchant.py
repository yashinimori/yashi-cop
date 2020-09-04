from django_filters import rest_framework as django_filters
from rest_framework import filters
from rest_framework import viewsets

from cop.core.api.serializers.merchant import MerchantSerializer
from cop.users.models import Merchant


class MerchantViewSet(viewsets.ModelViewSet):
    serializer_class = MerchantSerializer
    queryset = Merchant.objects.all().order_by('id')
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, django_filters.DjangoFilterBackend]
    filterset_fields = (
        'id',
        'bank',
        'merch_id',
        'name_legal',
        'bin',
        'name_ips',
        'mcc',
        'description',
        'address',
        'contact_person',
        'user',
    )
    search_fields = [
        'id',
        'bank',
        'merch_id',
        'name_legal',
        'bin',
        'name_ips',
        'mcc',
        'description',
        'address',
        'contact_person',
        'user'
    ]
