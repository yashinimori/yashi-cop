from rest_framework_simplejwt.views import TokenObtainPairView

from cop.users.api.serializers.token import CustomTokenObtainPairSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
