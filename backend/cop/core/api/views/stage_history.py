from rest_framework import filters
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

from cop.core.api.permissions.claim import AllowCurrentUsersPermission, AllowClaimMerchantPermission, \
    AllowChbOffPermission
from cop.core.api.serializers.stage_history import StageHistorySerializer
from cop.core.models import StageChangesHistory


class StageHistoryView(ListAPIView):
    permission_classes = [IsAuthenticated,
                          AllowCurrentUsersPermission | AllowClaimMerchantPermission | AllowChbOffPermission]
    serializer_class = StageHistorySerializer
    filter_backends = [filters.OrderingFilter]

    def get_queryset(self):
        return StageChangesHistory.objects.filter(claim=self.kwargs['pk'])
