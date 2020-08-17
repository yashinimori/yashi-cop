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
        validated_data['role'] = User.CARDHOLDER
        return super().create(validated_data)


class UserSerializer(BaseUserSerializer):
    claim_fields = serializers.CharField(required=False)

    class Meta(BaseUserSerializer.Meta):
        fields = BaseUserSerializer.Meta.fields + (
            'email',
            'first_name',
            'last_name',
            'phone',
            'role',
            'unit',
            'claim_fields',
            'registration_date',
        )
        read_only_fields = BaseUserSerializer.Meta.read_only_fields

    def update(self, instance, validated_data):
        if self.context["request"].user.role == User.CARDHOLDER:
            _ = validated_data.pop('role')
        return super().update(instance, validated_data)
