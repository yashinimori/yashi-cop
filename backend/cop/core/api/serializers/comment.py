from rest_framework import serializers

from cop.core.models import Comment


class CommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = ('id', 'text', 'user', 'claim')

    def create(self, validated_data):
        validated_data['user'] = self.context["request"].user
        return super(CommentSerializer, self).create(validated_data)

    def update(self, instance, validated_data):
        validated_data['user'] = self.context["request"].user
        return super(CommentSerializer, self).update(instance, validated_data)
