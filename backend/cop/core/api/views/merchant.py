from django_filters import rest_framework as django_filters
from rest_framework import filters
from rest_framework import viewsets

from cop.core.api.permissions.merchant import MerchantPermission
from cop.core.api.serializers.merchant import MerchantSerializer
from cop.core.models import Merchant


class MerchantViewSet(viewsets.ModelViewSet):
    permission_classes = [MerchantPermission]
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
    ]
