from django.shortcuts import get_object_or_404
from rest_framework import serializers

from cop.core.models import Claim, Merchant, Terminal, Document, Comment


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('id', 'text', 'user')


class DocumentSerialiser(serializers.ModelSerializer):
    file = serializers.FileField()
    class Meta:
        model = Document
        fields = ('id', 'file')


class ContentObjectRelatedField(serializers.RelatedField):
    def to_representation(self, value):
        if isinstance(value, Claim):
            serializer = ClaimSerializer(value)
            return serializer.data

    def to_internal_value(self, data):
        return Document.objects.get_or_create(file=data)


class ClaimSerializer(serializers.ModelSerializer):
    documents = ContentObjectRelatedField(queryset=Document.objects.all(), many=True)
    ch_comments = CommentSerializer(many=True, required=False)

    class Meta:
        model = Claim
        fields = (
            "id",
            "pan",
            "merch_name_ips",
            "term_id",
            "trans_amount",
            "trans_currency",
            "trans_approval_code",
            "ch_comments",
            "answers",
            "documents",
            "reason_code_group"
        )

    def create(self, validated_data):
        current_user = self.context["request"].user
        documents = validated_data.pop('documents')
        ch_comments = validated_data.pop('ch_comments', [])
        validated_data['user'] = current_user
        instance = super().create(validated_data)
        for comment_data in ch_comments:
            comment = Comment.objects.create(text=comment_data, user=current_user)
            instance.ch_comments.add(comment)
        if 'merch_id' in validated_data:
            self.assign_by_merch_id(validated_data['merch_id'], instance)
        if 'term_id' in validated_data:
            self.assign_by_term_id(validated_data['term_id'], instance)
        return instance

    def update(self, instance, validated_data):
        ch_comments = validated_data.pop('ch_comments', [])
        instance = super().update(instance, validated_data)
        for comment_data in ch_comments:
            comment = Comment.objects.create(text=comment_data, user=self.context["request"].user)
            instance.ch_comments.add(comment)
        return instance

    def assign_by_merch_id(self, merch_id, instance):
        merchant = get_object_or_404(Merchant, merch_id=merch_id)
        instance.merchant = merchant
        # TODO: decide which terminal to choose if there are multiple
        # terminal = get_object_or_404(Terminal, merchant=merchant)
        # instance.terminal = terminal
        instance.bank = merchant.bank
        instance.save()

    def assign_by_term_id(self, term_id, instance):
        terminal = get_object_or_404(Terminal, term_id=term_id)
        instance.terminal = terminal
        instance.merchant = terminal.merchant
        instance.bank = terminal.merchant.bank
        instance.save()


class ClaimListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Claim
        fields = (
            "id",
            "pan",
            "merch_name_ips",
            "term_id",
            "due_date",
            "trans_approval_code",
        )

