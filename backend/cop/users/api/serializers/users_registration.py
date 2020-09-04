from django.contrib.auth import get_user_model
from djoser.serializers import UserCreateSerializer as BaseUserRegistrationSerializer
from rest_framework import serializers

from cop.core.models import Terminal
from cop.users.models import Merchant, BankEmployee

User = get_user_model()


def set_password_change_required(instance):
    if instance.created_by.role in (User.Roles.COP_MANAGER, User.Roles.SECURITY_OFFICER, User.Roles.TOP_LEVEL):
        instance.password_change_required = True
        instance.save()


class CardholderRegistrationSerializer(BaseUserRegistrationSerializer):
    def create(self, validated_data):
        validated_data['role'] = User.Roles.CARDHOLDER
        return super().create(validated_data)


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
            'phone',
            'role',
            'created_by',
            'bankemployee',
        )

    def validate(self, attrs):
        password = User.objects.make_random_password()
        attrs['password'] = password
        self.context["password"] = password
        return attrs

    def create(self, validated_data):
        bank_employee = validated_data.pop('bankemployee')
        validated_data['created_by'] = self.context["request"].user
        instance = super().create(validated_data)

        set_password_change_required(instance)

        bank = bank_employee.get("bank")
        BankEmployee.objects.create(
            user=instance,
            bank=bank,
            unit=bank_employee.get("unit")
        )
        return instance


class TerminalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Terminal
        fields = (
            'term_id',
            'address',
        )


class MerchantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Merchant
        fields = (
            'bank',
            'merch_id',
            'name_legal',
            'bin',
            'name_ips',
            'mcc',
            'description',
            'address',
            'contact_person',
        )


class MerchantRegistrationSerializer(BaseUserRegistrationSerializer):
    merchant = MerchantSerializer()
    terminals = TerminalSerializer(many=True, required=False)

    class Meta(BaseUserRegistrationSerializer.Meta):
        model = User
        fields = BaseUserRegistrationSerializer.Meta.fields + (
            'email',
            'first_name',
            'last_name',
            'phone',
            'role',
            'created_by',
            'merchant',
            'terminals',
        )

    def validate(self, attrs):
        password = User.objects.make_random_password()
        attrs['password'] = password
        self.context["password"] = password
        merchant = attrs.pop('merchant')
        terminals = attrs.pop('terminals', None)
        attrs = super().validate(attrs)
        attrs['merchant'] = merchant
        attrs['terminals'] = terminals
        return attrs

    def create(self, validated_data):
        merchant = validated_data.pop('merchant')
        terminals = validated_data.pop('terminals', None)
        validated_data['created_by'] = self.context["request"].user
        instance = super().create(validated_data)

        set_password_change_required(instance)

        banks = merchant.pop("bank", None)
        merchant = Merchant.objects.create(user=instance, **merchant)
        if banks:
            for bank in banks:
                merchant.bank.add(bank)

        if terminals:
            for term in terminals:
                Terminal.objects.create(
                    term_id=term.get('term_id'),
                    address=term.get('address'),
                    merchant=merchant,
                )

        return instance

