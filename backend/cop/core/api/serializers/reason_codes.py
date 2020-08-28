from rest_framework import serializers

from cop.core.models import ReasonCodeGroup


class ReasonCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReasonCodeGroup
        fields = (
            'id',
            'code',
            'visa',
            'mastercard',
            'description',
        )
