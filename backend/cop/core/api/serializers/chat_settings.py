from cop.core.models import ChatSettings
from django.contrib.auth import get_user_model
from rest_framework import serializers

from cop.users.api.serializers.user import UserSerializer
User = get_user_model()

class ChatSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatSettings
        fields = ('id', 'claim', 'merch_id', 'chargeback_officer_id', 'cardholder_id')
