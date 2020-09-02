from rest_framework import serializers

from cop.logger.models import LoggerEntry


class LoggerEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LoggerEntry
        fields = (
            'id',
            'action_time',
            'user',
            'content_type',
            'object_id',
            'object_repr',
            'action_flag',
            'change_message',
            'ip',
        )
