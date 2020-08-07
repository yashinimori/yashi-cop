from rest_framework import serializers

from cop.core.models import Terminal


class TerminalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Terminal
        fields = (
            'id',
            'terminal_id',
            'merchant',
        )
