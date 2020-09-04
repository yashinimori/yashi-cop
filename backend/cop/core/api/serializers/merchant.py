from rest_framework import serializers

from cop.users.models import Merchant


class MerchantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Merchant
        fields = (
            'id',
            'user',
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
