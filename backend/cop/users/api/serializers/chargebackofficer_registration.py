from django.contrib.auth import get_user_model
from djoser.serializers import UserCreateSerializer as BaseUserRegistrationSerializer
from rest_framework import serializers

from cop.core.models import BankEmployee

User = get_user_model()


class BankEmployeeSerializes(serializers.ModelSerializer):
    class Meta:
        model = BankEmployee
        fields = (
            'bank',
            'unit',
        )


class ChargebackOfficerRegistrationSerializer(BaseUserRegistrationSerializer):
    bankemployee = BankEmployeeSerializes()

    class Meta(BaseUserRegistrationSerializer.Meta):
        model = User
        fields = (
            'email',
            'first_name',
            'last_name',
            'password',
            'phone',
            'role',
            'created_by',
            'bankemployee',
        )

    def validate(self, attrs):
        bank_employee = attrs.pop('bankemployee')
        attrs['bankemployee'] = bank_employee
        return attrs

    def create(self, validated_data):
        bank_employee = validated_data.pop('bankemployee')
        password = User.objects.make_random_password()
        validated_data['password'] = password
        validated_data['created_by'] = self.context["request"].user
        self.context["password"] = password
        instance = super().create(validated_data)

        bank = bank_employee.get("bank")
        BankEmployee.objects.create(
            user=instance,
            bank=bank,
            unit=bank_employee['unit']
        )
        return instance
