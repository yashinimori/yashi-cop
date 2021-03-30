from django_filters import rest_framework as django_filters
from rest_framework import filters
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from cop.core.api.permissions.bin import BinPermission
from cop.core.api.serializers.bin import BinSerializer
from cop.core.models import Bin


class BankViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, BinPermission]
    serializer_class = BinSerializer
    queryset = Bin.objects.all().order_by('id')
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, django_filters.DjangoFilterBackend]
    filterset_fields = (
        'id',
        'bank',
        'bin',
        'type',
        'product_code'
    )

    search_fields = [
        'id',
        'bank',
        'bin',
        'type',
        'product_code'
    ]
