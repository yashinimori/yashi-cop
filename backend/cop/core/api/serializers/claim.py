from rest_framework import serializers

from cop.core.models import Claim, Merchant, Terminal, Document, Comment, ReasonCodeGroup
from users.api.serializers.user import UserSerializer


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True, required=False)

    class Meta:
        model = Comment
        fields = ('id', 'text', 'user')


class ReasonCodeGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReasonCodeGroup
        fields = ('id', 'code', 'visa', 'mastercard', 'description')
        read_only = ('id',)


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
    documents = ContentObjectRelatedField(queryset=Document.objects.all(), many=True, required=False)
    ch_comments = CommentSerializer(many=True, required=False)
    claim_reason_code = serializers.CharField(source="claim_reason_code.code")

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
            "claim_reason_code",
            "reason_code_group",
            "reason_code",
            "trans_date",
            "action_needed",
            "result",
            "due_date",
            "stage"
        )

    def create(self, validated_data):
        current_user = self.context["request"].user
        documents = validated_data.pop('documents', None)
        ch_comments = validated_data.pop('ch_comments', [])
        claim_reason_code = validated_data.pop('claim_reason_code', None)
        if claim_reason_code:
            validated_data['claim_reason_code'] = ReasonCodeGroup.objects.get(**claim_reason_code)
        validated_data['user'] = current_user
        instance = super().create(validated_data)
        for comment_data in ch_comments:
            comment = Comment.objects.create(text=comment_data.get('text'), user=current_user)
            instance.ch_comments.add(comment)
        if 'merch_id' in validated_data:
            self.assign_by_merch_id(validated_data['merch_id'], instance)
        if 'term_id' in validated_data:
            self.assign_by_term_id(validated_data['term_id'], instance)
        return instance

    def update(self, instance, validated_data):
        ch_comments = validated_data.pop('ch_comments', [])
        claim_reason_code = validated_data.pop('claim_reason_code', None)
        if claim_reason_code:
            validated_data['claim_reason_code'] = ReasonCodeGroup.objects.get(code=claim_reason_code)
        instance = super().update(instance, validated_data)
        for comment_data in ch_comments:
            comment = Comment.objects.create(text=comment_data, user=self.context["request"].user)
            instance.ch_comments.add(comment)
        return instance

    def assign_by_merch_id(self, merch_id, instance):
        merchant = Merchant.objects.filter(merch_id=merch_id).first()
        if merchant:
            instance.merchant = merchant
            # TODO: decide which terminal to choose if there are multiple
            # terminal = get_object_or_404(Terminal, merchant=merchant)
            # instance.terminal = terminal
            instance.save()

    def assign_by_term_id(self, term_id, instance):
        terminal = Terminal.objects.filter(term_id=term_id).first()
        if terminal:
            instance.terminal = terminal
            instance.merchant = terminal.merchant
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
            "trans_date",
            "trans_amount",
            "trans_currency",
            "reason_code_group",
            "reason_code",
            "action_needed",
            "result",
            "stage"
        )

