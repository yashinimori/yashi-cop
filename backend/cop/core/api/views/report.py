from rest_framework.generics import CreateAPIView

from cop.core.api.serializers.report import ReportCreateSerializer
from cop.core.models import Report


class ReportCreateCreateView(CreateAPIView):
    serializer_class = ReportCreateSerializer
    queryset = Report.objects.all()
