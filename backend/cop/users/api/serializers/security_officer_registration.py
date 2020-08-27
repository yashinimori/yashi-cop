from django.contrib.auth import get_user_model
from djoser.serializers import UserCreateSerializer as BaseUserRegistrationSerializer

User = get_user_model()


class SecurityOfficerRegistrationSerializer(BaseUserRegistrationSerializer):
    class Meta(BaseUserRegistrationSerializer.Meta):
        fields = BaseUserRegistrationSerializer.Meta.fields + (
            'email',
            'first_name',
            'last_name',
            'password',
            'phone',
            'role',
        )

    def create(self, validated_data):
        validated_data['role'] = User.Roles.SECURITY_OFFICER
        return super().create(validated_data)
