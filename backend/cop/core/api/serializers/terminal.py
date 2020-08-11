from rest_framework import serializers

from cop.core.models import Terminal


class TerminalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Terminal
        fields = (
            'id',
            'term_id',
            'merchant__merch_id',
            'address',
        )
