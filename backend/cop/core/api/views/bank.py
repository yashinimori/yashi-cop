from django_filters import rest_framework as django_filters
from rest_framework import filters, mixins
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from cop.core.api.permissions.bank import BankPermission
from cop.core.api.serializers.bank import BankSerializer, BankBinSerializer
from cop.core.models import Bank, BankBin


class BankBinViewSet(
        mixins.CreateModelMixin,
        mixins.DestroyModelMixin,
        viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated, BankPermission]
    serializer_class = BankBinSerializer
    queryset = BankBin.objects.all()


class BankViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, BankPermission]
    serializer_class = BankSerializer
    queryset = Bank.objects.all().order_by('id')
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, django_filters.DjangoFilterBackend]
    filterset_fields = (
        'id',
        'bins',
        'type',
        'name_eng',
        'name_uk',
        'name_rus',
        'operator_name',
        'contact_person',
        'contact_telephone',
        'contact_email',
    )

    search_fields = [
        'id',
        'bins',
        'type',
        'name_eng',
        'name_uk',
        'name_rus',
        'operator_name',
        'contact_person',
        'contact_telephone',
        'contact_email',
    ]
