from rest_framework import serializers

from cop.core.models import SurveyQuestion


class SurveyQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SurveyQuestion
        fields = (
            'id',
            'description',
        )
