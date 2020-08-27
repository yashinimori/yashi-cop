from django.contrib.auth import get_user_model
from djoser.serializers import UserCreateSerializer as BaseUserRegistrationSerializer
from djoser.serializers import UserSerializer as BaseUserSerializer
from rest_framework import serializers

User = get_user_model()


class UserRegistrationSerializer(BaseUserRegistrationSerializer):
    class Meta(BaseUserRegistrationSerializer.Meta):
        fields = BaseUserRegistrationSerializer.Meta.fields + (
            'email',
            'first_name',
            'last_name',
            'password',
            'phone',
            'role',
        )

    def create(self, validated_data):
        validated_data['role'] = User.Roles.CARDHOLDER
        return super().create(validated_data)


class UserSerializer(BaseUserSerializer):
    claim_fields = serializers.CharField(required=False)
    password_change_required = serializers.SerializerMethodField()

    class Meta(BaseUserSerializer.Meta):
        fields = BaseUserSerializer.Meta.fields + (
            'is_active',
            'created_by',
            'email',
            'first_name',
            'last_name',
            'phone',
            'role',
            'claim_fields',
            'password_change_required',
            'registration_date',
        )
        read_only_fields = BaseUserSerializer.Meta.read_only_fields

    def update(self, instance, validated_data):
        validated_data.pop('role', None)
        return super().update(instance, validated_data)

    def get_password_change_required(self, instance):
        if instance.created_by:
            return instance.created_by.role in (
            User.Roles.COP_MANAGER, User.Roles.SECURITY_OFFICER, User.Roles.TOP_LEVEL) and not instance.last_login
        else:
            return False
