from django.contrib.auth import get_user_model
from django_filters import rest_framework as django_filters
from rest_framework import filters
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from cop.core.api.serializers.chat_settings import ChatSettingsSerializer
from cop.core.models import ChatSettings


User = get_user_model()


class ChatSettingsViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = ChatSettingsSerializer
    queryset = ChatSettings.objects \
        .select_related('claim') \
        .order_by('id')
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, django_filters.DjangoFilterBackend]
    filterset_fields = (
        "id",
        "claim",
        "merch_id",
        "chargeback_officer_id",
        "cardholder_id",
    )

    filterset_fields = [
        "id",
        "claim",
        "merch_id",
        "chargeback_officer_id",
        "cardholder_id",
    ]
