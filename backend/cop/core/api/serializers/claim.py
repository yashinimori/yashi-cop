from rest_framework import serializers

from cop.core.models import Claim
from cop.core.reason_codes import ReasonCodes


class ClaimSerializer(serializers.ModelSerializer):
    class Meta:
        model = Claim
        fields = (
            "id",
            "user",
            "merchant",
            "first_name",
            "last_name",
            "email",
            "telephone",
            "source",
            "arn",
            "flag",
            "bank",
            "transaction",
            "terminal",
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

    def create(self, validated_data):
        # TODO assign claim
        if validated_data['reason_code'] == ReasonCodes.NO_CARDHOLDER_AUTHORIZATION:
            pass
        elif validated_data['reason_code'] == ReasonCodes.NO_CARDHOLDER_AUTHORIZATION:
            pass
        return super().create(validated_data)

