from django_filters import rest_framework as django_filters
from rest_framework import filters
from rest_framework import viewsets

from cop.core.api.serializers.atm import ATMSerializer
from cop.core.models import ATM


class ATMViewSet(viewsets.ModelViewSet):
    serializer_class = ATMSerializer
    queryset = ATM.objects.all().order_by('id')
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
