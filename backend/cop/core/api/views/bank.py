from django_filters import rest_framework as django_filters
from rest_framework import filters
from rest_framework import viewsets

from cop.core.api.serializers.bank import BankSerializer
from cop.core.models import Bank


class BankViewSet(viewsets.ModelViewSet):
    serializer_class = BankSerializer
    queryset = Bank.objects.all().order_by('id')
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, django_filters.DjangoFilterBackend]

    search_fields = [
        'id',
        'bin',
        'name_eng',
        'name_uk',
        'name_rus',
        'contact_person',
        'contact_telephone',
        'contact_email',
    ]