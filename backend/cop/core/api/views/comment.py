from django_filters import rest_framework as django_filters
from rest_framework import filters
from rest_framework import viewsets

from cop.core.api.serializers.comment import CommentSerializer
from cop.core.models import Comment


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    queryset = Comment.objects.select_related('claim', 'user')

    filter_backends = [filters.SearchFilter, filters.OrderingFilter, django_filters.DjangoFilterBackend]
    filterset_fields = (
        "text",
        "claim__id",
        "user__role",
    )
    search_fields = [
        "text",
        "claim__id",
        "claim__pan",
    ]
