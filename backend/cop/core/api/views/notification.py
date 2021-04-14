from django.contrib.auth import get_user_model
from django_filters import rest_framework as django_filters
from rest_framework import filters
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from cop.core.api.serializers.notification import NotificationSerializer
from cop.core.models import Notification

User = get_user_model()

class NotificationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer
    queryset = Notification.objects.all().order_by('id')
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, django_filters.DjangoFilterBackend]
    filterset_fields = (
        'id',
        'claim',
        'text',
        'is_active'
    )
    search_fields = [
        'id',
        'claim',
        'text',
        'is_active'
    ]


class NotificationManagerView(APIView):
    def post(self, request):
        for role in (User.Roles.MERCHANT, User.Roles.CARDHOLDER, User.Roles.CC_BRANCH, User.Roles.CHARGEBACK_OFFICER):
            self.create_notification(request, role)


    def create_notification(self, request, role):
        data = request.data
        serializer = NotificationSerializer(data=data)
        serializer.save()
