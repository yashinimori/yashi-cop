from rest_framework import filters
from rest_framework import viewsets

from cop.core.api.serializers.surveyquestion import SurveyQuestionSerializer
from cop.core.models import SurveyQuestion


class SurveyQuestionViewSet(viewsets.ModelViewSet):
    serializer_class = SurveyQuestionSerializer
    queryset = SurveyQuestion.objects.all().order_by('id')
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]

    search_fields = [
        'id',
        'description',
    ]
