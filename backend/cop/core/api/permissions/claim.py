from rest_framework.permissions import BasePermission

from cop.core.models import Claim, Status


class AllowCurrentUsersPermission(BasePermission):
    def has_permission(self, request, view):
        if 'pk' in view.kwargs:
            current_claim = Claim.objects.get(id=view.kwargs['pk'])
            return request.user == current_claim.user
        else:
            return False


class AllowClaimMerchantPermission(BasePermission):
    def has_permission(self, request, view):
        if 'pk' in view.kwargs:
            current_claim = Claim.objects.get(id=view.kwargs['pk'])
            if current_claim.merchant:
                return request.user == current_claim.merchant.user
            else:
                return False
        else:
            return False


class AllowChbOffPermission(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_chargeback_officer


class HasMerchantClaimUpdatePermission(BasePermission):
    def has_permission(self, request, view):
        if view.action == 'update' and request.user.is_merchant:
            claim = view.get_object()
            merchant_can_answer_stages = claim.status.stage in [Status.Stages.PRE_MEDIATION, Status.Stages.MEDIATION]
            return merchant_can_answer_stages
        return True
