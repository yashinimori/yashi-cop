from django.contrib.auth import get_user_model
from rest_framework import serializers

from cop.core.models import Merchant

User = get_user_model()


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


class MerchantRegistrationSerializer(serializers.ModelSerializer):
    merchant = MerchantSerializer()

    class Meta:
        model = User
        fields = (
            'email',
            'first_name',
            'last_name',
            'password',
            'phone',
            'role',
            'merchant'
        )

    def create(self, validated_data):
        merchant = validated_data.pop('merchant')
        instance = User.objects.create(**validated_data)
        banks = merchant.pop("bank")
        merchant = Merchant.objects.create(user=instance, **merchant)
        if banks:
            for bank in banks:
                merchant.bank.add(bank)
            merchant.save()
        return instance

