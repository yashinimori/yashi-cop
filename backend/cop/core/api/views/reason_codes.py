from django_filters import rest_framework as django_filters
from rest_framework import filters
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

from cop.core.api.permissions.reason_codes import ReasonCodeListViewPermission
from cop.core.api.serializers.reason_codes import ReasonCodeSerializer
from cop.core.models import ReasonCodeGroup


class ReasonCodeListAPIView(ListAPIView):
    permission_classes = [IsAuthenticated, ReasonCodeListViewPermission]
    serializer_class = ReasonCodeSerializer
    queryset = ReasonCodeGroup.objects.all().order_by('id')
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, django_filters.DjangoFilterBackend]
    filterset_fields = (
        'id',
        'code',
        'visa',
        'mastercard',
        'description',
    )

    search_fields = [
        'id',
        'code',
        'visa',
        'mastercard',
        'description',
    ]
