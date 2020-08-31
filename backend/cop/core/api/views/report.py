from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated

from cop.core.api.permissions.base import ChargebackOfficerOnly
from cop.core.api.serializers.report import ReportCreateSerializer
from cop.core.models import Report


class ReportCreateCreateView(CreateAPIView):
    permission_classes = [IsAuthenticated, ChargebackOfficerOnly]
    serializer_class = ReportCreateSerializer
    queryset = Report.objects.all()
