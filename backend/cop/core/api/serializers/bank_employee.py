from rest_framework import serializers

from cop.core.api.serializers.atm import ATMSerializer
from cop.core.api.serializers.claim import BankSerializer
from cop.core.models import BankEmployee
from cop.users.api.serializers.user import UserSerializer


class BankEmployeeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    atm = ATMSerializer(read_only=True, many=True)
    bank = BankSerializer(read_only=True)

    class Meta:
        model = BankEmployee
        fields = (
            'id',
            'user',
            'bank',
            'unit',
            'atm',
        )
