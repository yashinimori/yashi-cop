from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils.module_loading import import_string
from djoser import signals
from djoser.conf import settings as djoser_settings
from djoser.views import UserViewSet as DjoserUserViewSet
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, UpdateModelMixin
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from djoser.compat import get_user_email

from cop.users.api.serializers.user import UserSerializer
from cop.users.api.serializers.users_registration import CardholderRegistrationSerializer, \
    MerchantRegistrationSerializer, ChargebackOfficerRegistrationSerializer

User = get_user_model()


class CustomRegistrationView(DjoserUserViewSet):

    @staticmethod
    def is_create_serializer(serializer_class):
        default_create_serializer = import_string(settings.DJOSER['SERIALIZERS']['user_create'])
        return serializer_class == default_create_serializer

    def get_serializer_class(self):
        serializer_class = super().get_serializer_class()

        if self.is_create_serializer(serializer_class):
            return self.get_serializer_based_on_role(serializer_class)
        else:
            return serializer_class

    def get_serializer_based_on_role(self, serializer_class):
        role = self.request.data.get('role')
        serializer_class = self.get_role_serializer(role, serializer_class)
        return serializer_class

    @staticmethod
    def get_role_serializer(role, default_serializer):
        role_serializer_binding = {
            User.Roles.MERCHANT: MerchantRegistrationSerializer,
            User.Roles.CHARGEBACK_OFFICER: ChargebackOfficerRegistrationSerializer,
            User.Roles.TOP_LEVEL: ChargebackOfficerRegistrationSerializer,
            User.Roles.SECURITY_OFFICER: ChargebackOfficerRegistrationSerializer,
            User.Roles.CARDHOLDER: CardholderRegistrationSerializer,
        }
        if role in role_serializer_binding:
            return role_serializer_binding[role]
        return default_serializer

    def perform_create(self, serializer):
        user = serializer.save()
        signals.user_registered.send(
            sender=self.__class__, user=user, request=self.request
        )
        context = {
            "user": user,
            "password": serializer.validated_data['password'],
        }
        to = [get_user_email(user)]
        if djoser_settings.SEND_ACTIVATION_EMAIL and user.is_cardholder:
            djoser_settings.EMAIL.activation(self.request, context, template_name='email/custom_activation.html').send(
                to)
        elif djoser_settings.SEND_CONFIRMATION_EMAIL:
            djoser_settings.EMAIL.confirmation(self.request, context).send(to)


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
