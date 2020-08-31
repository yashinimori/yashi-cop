from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils.module_loading import import_string
from djoser.views import UserViewSet as DjoserUserViewSet
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, UpdateModelMixin
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from cop.users.api.serializers.user import UserSerializer
from cop.users.api.serializers.users_registration import CardholderRegistrationSerializer, \
    SecurityOfficerRegistrationSerializer, MerchantRegistrationSerializer, ChargebackOfficerRegistrationSerializer

User = get_user_model()


class CustomRegistrationView(DjoserUserViewSet):
    @staticmethod
    def is_create_serializer(serializer_class):
        default_create_serializer = import_string(settings.DJOSER['SERIALIZERS']['user_create'])
        return serializer_class == default_create_serializer

    def get_serializer_class(self):
        serializer_class = super().get_serializer_class()
        # handling user_create
        if self.request.user.is_authenticated and self.is_create_serializer(serializer_class):
            return self.get_serializer_based_on_role(serializer_class)
        else:
            return CardholderRegistrationSerializer

    @staticmethod
    def can_create_all_user_types(user):
        return user.is_cop_manager or user.is_security_officer

    def get_serializer_based_on_role(self, serializer_class):
        role = self.request.data.get('role')
        user = self.request.user
        if self.can_create_all_user_types(user):
            serializer_class = self.get_role_serializer(role, serializer_class)
        elif user.is_top_level:
            serializer_class = SecurityOfficerRegistrationSerializer
        else:
            raise PermissionDenied({"message": "You don't have permission to perform this action"})
        return serializer_class

    @staticmethod
    def get_role_serializer(role, default_serializer):
        role_serializer_binding = {
            User.Roles.MERCHANT: MerchantRegistrationSerializer,
            User.Roles.CHARGEBACK_OFFICER: ChargebackOfficerRegistrationSerializer,
            User.Roles.CARDHOLDER: CardholderRegistrationSerializer,
        }
        if role in role_serializer_binding:
            return role_serializer_binding[role]
        return default_serializer


class UserViewSet(RetrieveModelMixin, ListModelMixin, UpdateModelMixin, GenericViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    lookup_field = "username"

    def get_queryset(self, *args, **kwargs):
        return self.queryset.filter(id=self.request.user.id)

    @action(detail=False, methods=["GET"])
    def me(self, request):
        serializer = UserSerializer(request.user, context={"request": request})
        return Response(status=status.HTTP_200_OK, data=serializer.data)
