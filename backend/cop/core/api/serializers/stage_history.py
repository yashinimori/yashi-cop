from rest_framework import serializers

from cop.core.models import StageChangesHistory


class StageHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = StageChangesHistory
        fields = (
            'user',
            'claim',
            'reason',
            'create_date',
        )
