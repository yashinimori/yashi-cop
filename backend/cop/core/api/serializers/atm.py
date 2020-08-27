from rest_framework import serializers

from cop.core.models import ATM


class ATMSerializer(serializers.ModelSerializer):
    class Meta:
        model = ATM
        fields = (
            'id',
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
