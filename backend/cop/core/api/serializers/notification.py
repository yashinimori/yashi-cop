from rest_framework import serializers

from cop.core.models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = (
            'id',
            'claim',
            'user',
            'text',
            'is_active'
        )
