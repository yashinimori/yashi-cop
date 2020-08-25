from rest_framework.generics import CreateAPIView

from cop.core.api.permissions.report import CreateReportPermission
from cop.core.api.serializers.report import ReportCreateSerializer
from cop.core.models import Report


class ReportCreateCreateView(CreateAPIView):
    permission_classes = [CreateReportPermission]
    serializer_class = ReportCreateSerializer
    queryset = Report.objects.all()
