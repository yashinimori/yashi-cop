from rest_framework import serializers

from cop.core.models import Bin


class BinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bin
        fields = (
            'id',
            'bank',
            'bin',
            'type',
            'product_code'
        )
