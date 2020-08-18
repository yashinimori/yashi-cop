from rest_framework import serializers

from cop.core.models import Report


class ReportCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = (
            'log',
            'status',
            'error',
        )
