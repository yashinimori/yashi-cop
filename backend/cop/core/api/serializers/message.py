from cop.core.models import Message, MessageFile
from django.contrib.auth import get_user_model
from rest_framework import serializers

from cop.users.api.serializers.user import UserSerializer
User = get_user_model()

class MessageFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageFile
        fields = ('id', 'upload_to', 'message', 'create_date')


class MessageSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    message_files = MessageFileSerializer(many=True, read_only=True)
    class Meta:
        model = MessageFile
        fields = ('id', 'text', 'user', 'message_files')


