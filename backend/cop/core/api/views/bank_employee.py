from django_filters import rest_framework as django_filters
from rest_framework import filters
from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView

from cop.core.api.serializers.bank_employee import BankEmployeeSerializer
from cop.core.models import BankEmployee


class BankEmployeeList(ListAPIView):
    serializer_class = BankEmployeeSerializer
    queryset = BankEmployee.objects.all().order_by('id') \
        .prefetch_related("atm") \
        .select_related("user", "bank")
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, django_filters.DjangoFilterBackend]
    filterset_fields = (
        'user',
        'bank',
        'unit',
        'atm',
    )

    search_fields = [
        'user',
        'bank',
        'unit',
        'atm',
    ]


class BankEmployeeRetrieveUpdate(RetrieveUpdateAPIView):
    serializer_class = BankEmployeeSerializer
    queryset = BankEmployee.objects.all() \
        .order_by('id') \
        .prefetch_related("atm") \
        .select_related("user", "bank")
