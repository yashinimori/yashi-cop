from django.contrib.auth import get_user_model
from djoser.compat import get_user_email
from djoser.conf import settings as djoser_settings
from django_filters import rest_framework as django_filters
from rest_framework import filters
from rest_framework import viewsets
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from cop.core.api.serializers.notification import NotificationSerializer
from cop.core.models import Notification, Claim

User = get_user_model()


class NotificationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer
    queryset = Notification.objects.all().order_by('id')
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, django_filters.DjangoFilterBackend]
    filterset_fields = (
        'id',
        'claim',
        'user',
        'text',
        'is_active'
    )
    search_fields = [
        'id',
        'claim',
        'user',
        'text',
        'is_active'
    ]


class NotificationManagerView(APIView):
    def post(self, request):
        data = request.data
        self.claim = Claim.objects.get(pk=data["claim"])
        data['is_active'] = True
        for role in (User.Roles.MERCHANT, User.Roles.CHARGEBACK_OFFICER, request.user.role):
            if (role == "merchant"):
                if(self.claim.merchant):
                    data["user"] = str(self.claim.merchant.id)
                else:
                    data["user"] = None
            if (role == "chargeback_officer"):
                if(self.claim.chargeback_officer):
                    data["user"] = str(self.claim.chargeback_officer.id)
                else:
                    data["user"] = None
            else:
                data['user'] = request.user.id
            self.create_notification(data, role)
        
        print("Claim", self.claim, "Merchant", self.claim.merchant)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def create_notification(self, data, role):
        text = {
            'create': {
                'merchant': "Сформовано скаргу №" + str(data["claim"]) + " Необхідно надати документи, що підтверджують операцію в строк до 3х рабочих днів.",
                'chargeback_officer': "Сформовано скаргу №" + str(data["claim"]),
                'cardholder': "Сформовано скаргу №" + str(data["claim"]) + " Очікуйте попередьного результату в строк до 7 робочих днів.",
                'сс_branch': "Сформовано скаргу №" + str(data["claim"]) + " Очікуйте попередьного результату в строк до 7 робочих днів.",
            },
            'escalate': {
                'merchant': "По скарзі №" + str(data["claim"]) + " надана нова інформація. Просимо надіслати відповідь в строк до 3х рабочих днів",
                'chargeback_officer': "По скарзі №" + str(data["claim"]) + " надана нова інформація",
                'cardholder': "По скарзі №" + str(data["claim"]) + " надана нова інформація. Просимо надіслати відповідь в строк до 3х рабочих днів",
                'сс_branch': " По скарзі №" + str(data["claim"]) + " надана нова інформація. Просимо надіслати відповідь в строк до 3х рабочих днів",
            },
            'close': {
                'merchant': None,
                'chargeback_officer': "Cкарга №" + str(data["claim"]) + " закрита ініціатором.",
                'cardholder': "Розгляд скарги №" + str(data["claim"]) + " завершено. Просимо ознайомитися з наданою інформацією",
                'сс_branch': "Розгляд скарги №" + str(data["claim"]) + " завершено. Просимо ознайомитися з наданою інформацією",
            },
        }
        if (role == "merchant" and self.claim.merchant == None) or (role == "chargeback_officer" and self.claim.chargeback_officer == None):
            return False
        if text[data['action']][role]:
            data['text'] = text[data['action']][role]
        for i in data:
            print(data[i], type(i))
        print (data['user'])
        serializer = NotificationSerializer(data=data)
        print("Validation", serializer.is_valid())
        if serializer.is_valid():
            serializer.save()
        user = User.objects.get(id=data['user'])
        to = [get_user_email(user)]
        context = {
            "user": user,
            "text": data['text']
        }
        djoser_settings.EMAIL.notification(self.request, context).send(to)
        