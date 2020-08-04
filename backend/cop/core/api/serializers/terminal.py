from rest_framework import serializers

from cop.core.api.serializers.merchant import MerchantSerializer
from cop.core.models import Terminal


class TerminalSerializer(serializers.ModelSerializer):
    merchant = MerchantSerializer(read_only=True)

    class Meta:
        model = Terminal
        fields = (
            'id',
            'terminal_id',
            'merchant',
        )
