from rest_framework import serializers

from cop.core.models import StageChangesHistory
from cop.users.api.serializers.user import UserSerializerLite


class StageHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = StageChangesHistory
        fields = (
            'user',
            'status_from',
            'status_to',
            'claim',
            'reason',
            'create_date',
        )


class StageHistorySerializerLite(serializers.ModelSerializer):
    user = UserSerializerLite()

    class Meta:
        model = StageChangesHistory
        fields = (
            'id',
            'status_from',
            'status_to',
            'user',
            'reason',
            'create_date',
        )
