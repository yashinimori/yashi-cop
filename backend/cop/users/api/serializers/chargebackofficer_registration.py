from django.contrib.auth import get_user_model
from rest_framework import serializers

from cop.core.models import BankEmployee

User = get_user_model()


class BankEmployeeSerializes(serializers.ModelSerializer):
    class Meta:
        model = BankEmployee
        fields = (
            'bank',
        )


class ChargebackOfficerRegistrationSerializer(serializers.ModelSerializer):
    bankemployee = BankEmployeeSerializes()

    class Meta:
        model = User
        fields = (
            'email',
            'first_name',
            'last_name',
            'password',
            'phone',
            'role',
            'bankemployee'
        )

    def create(self, validated_data):
        bank_employee = validated_data.pop('bankemployee')
        instance = User.objects.create(**validated_data)
        bank = bank_employee.get("bank")
        BankEmployee.objects.create(
            user=instance, bank=bank
        )
        return instance
