from rest_framework import serializers

from cop.core.models import StageChangesHistory
from cop.users.api.serializers.user import UserSerializerLight


class StageHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = StageChangesHistory
        fields = (
            'user',
            'claim',
            'reason',
            'create_date',
        )


class StageHistoryNestedSerializer(serializers.ModelSerializer):
    user = UserSerializerLight()

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
