from django.shortcuts import get_object_or_404
from rest_framework import serializers

from cop.core.models import Comment, Claim
from cop.users.api.serializers.user import UserSerializerLite


class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('text',)

    def create(self, validated_data):
        claim_pk = self.context.get('view').kwargs.get('pk')
        claim = get_object_or_404(Claim, pk=claim_pk)
        validated_data['user'] = self.context["request"].user
        validated_data['claim'] = claim
        return super(CommentCreateSerializer, self).create(validated_data)


class CommentListSerializer(serializers.ModelSerializer):
    user = UserSerializerLite()

    class Meta:
        model = Comment
        fields = (
            'id',
            'text',
            'user',
            'create_date',
        )
