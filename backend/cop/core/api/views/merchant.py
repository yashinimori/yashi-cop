from django_filters import rest_framework as django_filters
from rest_framework import filters
from rest_framework import viewsets

from cop.core.api.serializers.merchant import MerchantSerializer
from cop.core.models import Merchant


class MerchantViewSet(viewsets.ModelViewSet):
    serializer_class = MerchantSerializer
    queryset = Merchant.objects.all().order_by('id')
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, django_filters.DjangoFilterBackend]
    filterset_fields = (
        'bank__id',
        'bank__name_eng',
        'contact_person',
        'mcc',
    )

    search_fields = [
        'id',
        'bank__name_eng',
        'merchant_id',
        'merchant_name_legal',
        'merchant_name_ips',
        'mcc',
        'description',
        'telephone',
        'email',
        'address',
        'terminal_id',
        'contact_person',
    ]
