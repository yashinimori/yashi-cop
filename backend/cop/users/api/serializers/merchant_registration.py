from django.contrib.auth import get_user_model
from djoser.serializers import UserCreateSerializer as BaseUserRegistrationSerializer
from rest_framework import serializers

from cop.core.models import Merchant, Terminal

User = get_user_model()


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
            'password',
            'phone',
            'role',
            'created_by',
            'merchant',
            'terminals',
        )

    def validate(self, attrs):
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
        password = User.objects.make_random_password()
        validated_data['password'] = password
        self.context["password"] = password
        instance = super().create(validated_data)
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

