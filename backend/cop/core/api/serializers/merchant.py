from rest_framework import serializers

from cop.core.models import Merchant


class MerchantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Merchant
        fields = (
            'id',
            'bank',
            'merchant_id',
            'merchant_name_legal',
            'mcc',
            'description',
            'telephone',
            'email',
            'merchant_name_ips',
            'address',
            'terminal_id',
            'contact_person',
        )
