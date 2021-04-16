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
        data = request.data
        data['user'] = request.user
        data['is_active'] = True
        for role in (User.Roles.MERCHANT, User.Roles.CHARGEBACK_OFFICER, request.user.role):
            print(role)
            self.create_notification(data, role)


    def create_notification(self, data, role):
        text = {
            'create': {
                'merchant': "Сформовано скаргу №. Необхідно надати документи, що підтверджують операцію в строк до 3х рабочих днів.",
                'chargeback_officer': "Сформовано скаргу №",
                'cardholder': "Сформовано скаргу №. Очікуйте попередьного результату в строк до 7 робочих днів.",
                'сс_branch': "Сформовано скаргу №. Очікуйте попередьного результату в строк до 7 робочих днів.",
            },
            'escalate': {
                'merchant': "По скарзі № надана нова інформація. Просимо надіслати відповідь в строк до 3х рабочих днів",
                'chargeback_officer': "По скарзі № надана нова інформація",
                'cardholder': "По скарзі № надана нова інформація. Просимо надіслати відповідь в строк до 3х рабочих днів",
                'сс_branch': " По скарзі № надана нова інформація. Просимо надіслати відповідь в строк до 3х рабочих днів",
            },
            'close': {
                'merchant': None,
                'chargeback_officer': "Cкарга № закрита ініціатором.",
                'cardholder': "Розгляд скарги № завершено. Просимо ознайомитися з наданою інформацією",
                'сс_branch': "Розгляд скарги № завершено. Просимо ознайомитися з наданою інформацією",
            },
        }
        if text[data['action']][role]:
            data['text'] = text[data['action']][role]
        serializer = NotificationSerializer(data=data)
        serializer.save()
