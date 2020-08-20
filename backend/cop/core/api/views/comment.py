from rest_framework.generics import CreateAPIView

from cop.core.api.permissions.claim import AllowCurrentUsersPermission, AllowClaimMerchantPermission, \
    AllowChbOffPermission
from cop.core.api.serializers.comment import CommentCreateSerializer
from cop.core.models import Comment


class CommentCreateView(CreateAPIView):
    permission_classes = [AllowCurrentUsersPermission | AllowClaimMerchantPermission | AllowChbOffPermission]
    serializer_class = CommentCreateSerializer
    queryset = Comment.objects.all()
