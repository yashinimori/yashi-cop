from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated

from cop.core.api.permissions.claim import AllowCurrentUsersPermission, AllowClaimMerchantPermission, \
    AllowChbOffPermission
from cop.core.api.serializers.comment import CommentCreateSerializer
from cop.core.models import Comment


class CommentCreateView(CreateAPIView):
    permission_classes = [IsAuthenticated,
                          AllowCurrentUsersPermission | AllowClaimMerchantPermission | AllowChbOffPermission]
    serializer_class = CommentCreateSerializer
    queryset = Comment.objects.all()
