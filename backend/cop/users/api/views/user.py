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

from cop.users.api.serializers.chargebackofficer_registration import ChargebackOfficerRegistrationSerializer
from cop.users.api.serializers.merchant_registration import MerchantRegistrationSerializer
from cop.users.api.serializers.user import UserSerializer

User = get_user_model()


class CustomRegistrationView(DjoserUserViewSet):

    def get_serializer_class(self):
        serializer_class = super(CustomRegistrationView, self).get_serializer_class()

        # handling user_create
        if serializer_class == import_string(settings.DJOSER['SERIALIZERS']['user_create']):
            serializer_class = self.get_serializer_based_on_role(serializer_class)

        return serializer_class

    def get_serializer_based_on_role(self, serializer_class):
        data = self.request.data
        current_user = self.request.user
        if current_user.is_authenticated:
            if data.get('role') == User.MERCHANT:
                if current_user.is_cop_manager:
                    serializer_class = MerchantRegistrationSerializer
                else:
                    raise PermissionDenied({"message": "You don't have permission to access"})
            elif data.get('role') == User.CHARGEBACK_OFFICER:
                if current_user.is_cop_manager:
                    serializer_class = ChargebackOfficerRegistrationSerializer
                else:
                    raise PermissionDenied({"message": "You don't have permission to access"})
        return serializer_class


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
