from django.shortcuts import get_object_or_404
from rest_framework import serializers

from cop.core.models import Claim, Merchant, Terminal


class ClaimSerializer(serializers.ModelSerializer):
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
            "source",
            "arn",
            "flag",
            "reason_code_group",
            "action_needed",
            "comment",
            "stage",
            "result",
            "support",
            "answers",
            "reason_code",
            "due_date",
            "dispute_date",
        )
        read_only = ('merchant', 'bank', 'terminal')

    def assign_by_merch_id(self, merch_id, instance):
        merchant = get_object_or_404(Merchant, merchant_id=int(merch_id))
        instance.merchant = merchant
        terminal = get_object_or_404(Terminal, merchant=merchant)
        instance.terminal = terminal
        instance.bank = merchant.bank
        instance.save()

    def assign_by_term_id(self, term_id, instance):
        terminal = get_object_or_404(Terminal, terminal_id=int(term_id))
        instance.terminal = terminal
        instance.merchant = terminal.merchant
        instance.bank = terminal.merchant.bank
        instance.save()

    def create(self, validated_data):
        instance = super().create(validated_data)
        if validated_data['merch_id']:
            self.assign_by_merch_id(validated_data['merch_id'], instance)
        if validated_data['term_id']:
            self.assign_by_term_id(validated_data['term_id'], instance)
        return instance

