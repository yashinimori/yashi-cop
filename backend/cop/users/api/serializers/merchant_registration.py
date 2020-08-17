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
            'terminal_id',
            'contact_person',
        )


class MerchantRegistrationSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    phone = serializers.CharField(required=True)
    role = serializers.CharField(required=False)
    merchant = MerchantSerializer()

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

