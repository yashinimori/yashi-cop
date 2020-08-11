from rest_framework import serializers

from cop.core.models import Merchant


class MerchantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Merchant
        fields = (
            'id',
            'bank',
            'merch_id',
            'name_legal',
            'bin',
            'name_ips',
            'mcc',
            'description',
            'telephone',
            'email',
            'address',
            'terminal_id',
            'contact_person',
        )
