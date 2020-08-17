from rest_framework import serializers

from cop.core.models import Transaction


class TransactionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Transaction
        fields = (
            'id',
            'bank',
            'terminal',
            'merchant',
            'pan',
            'trans_amount',
            'currency',
            'approval_code',
            'cash_count',
            'error',
            'result',
            'mcc',
            'trans_start',
            'trans_end',
            'pin_entered',
            'cash_request',
            'cash_presented',
            'cash_retracted',
            'cash_taken',
            'card_taken',
        )
