from django.contrib.auth import get_user_model
from django_filters import rest_framework as django_filters
from rest_framework import filters
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from cop.core.api.serializers.message import MessageSerializer, MessageFileSerializer
from cop.core.models import Message, MessageFile


User = get_user_model()


class MessageViewSet(viewsets.ModelViewSet):
    permission_classes = IsAuthenticated
    serializer_class = MessageSerializer
    queryset = Message.objects \
        .select_related('user') \
        .order_by('id')
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, django_filters.DjangoFilterBackend]
    filterset_fields = (
        "id",
        "user",
        "text",
        "message_files",
    )

    filterset_fields = [
        "id",
        "user",
        "text",
        "message_files",
    ]


class MessageFileViewSet(CreateAPIView):
    serializer_class = MessageSerializer
    queryset = MessageFile.objects.all()
