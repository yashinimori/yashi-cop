from django.shortcuts import get_object_or_404
from rest_framework import serializers

from cop.core.models import Claim, Merchant, Terminal, Document


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

    class Meta:
        model = Claim
        fields = (
            "id",
            "user",
            "merch_id",
            "term_id",
            "pan",
            "merchant",
            "bank",
            "terminal",
            "transaction",
            "first_name",
            "last_name",
            "email",
            "telephone",
            "issuer_mmt",
            "dispute_mmt",
            "ch_mmt",
            "merchant_mmt",
            "source",
            "arn",
            "flag",
            "reason_code_group",
            "action_needed",
            "comment",
            "ch_comments",
            "bank_comments",
            "merchant_comments",
            "stage",
            "result",
            "support",
            "answers",
            "reason_code",
            "due_date",
            "dispute_date",
            "registration_date",
            "final_date",
            "chargeback_date",
            "second_presentment_date",
            "pre_arbitration_date",
            "pre_arbitration_response_date",
            "arbitration_date",
            "arbitration_response_date",
            "documents",
        )
        read_only = ('merchant', 'bank', 'terminal')

    def assign_by_merch_id(self, merch_id, instance):
        merchant = get_object_or_404(Merchant, merch_id=int(merch_id))
        instance.merchant = merchant
        terminal = get_object_or_404(Terminal, merchant=merchant)
        instance.terminal = terminal
        instance.bank = merchant.bank
        instance.save()

    def assign_by_term_id(self, term_id, instance):
        terminal = get_object_or_404(Terminal, term_id=int(term_id))
        instance.terminal = terminal
        instance.merchant = terminal.merchant
        instance.bank = terminal.merchant.bank
        instance.save()

    def create(self, validated_data):
        documents = validated_data.pop('documents')

        instance = super().create(validated_data)
        if validated_data['merch_id']:
            self.assign_by_merch_id(validated_data['merch_id'], instance)
        if validated_data['term_id']:
            self.assign_by_term_id(validated_data['term_id'], instance)
        return instance
