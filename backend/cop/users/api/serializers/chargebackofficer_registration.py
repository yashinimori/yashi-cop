from django.contrib.auth import get_user_model

from cop.users.api.serializers.user import UserRegistrationSerializer

User = get_user_model()


class ChargebackOfficerRegistrationSerializer(UserRegistrationSerializer):
    def create(self, validated_data):
        instance = super().create(validated_data)
        instance.role = User.CHARGEBACK_OFFICER
        instance.save()
        return instance
