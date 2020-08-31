from django.contrib.auth import user_logged_in
from rest_framework_simplejwt.serializers import TokenObtainSerializer
from rest_framework_simplejwt.tokens import RefreshToken


class SignalTokenObtainSerializer(TokenObtainSerializer):
    def validate(self, attrs):
        super(SignalTokenObtainSerializer, self).validate(attrs)
        user_logged_in.send(
            sender=self.user.__class__, request=self.context['request'], user=self.user
        )
        return {}


class CustomTokenObtainPairSerializer(SignalTokenObtainSerializer):
    @classmethod
    def get_token(cls, user):
        return RefreshToken.for_user(user)

    def validate(self, attrs):
        data = super().validate(attrs)

        refresh = self.get_token(self.user)

        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        return data
