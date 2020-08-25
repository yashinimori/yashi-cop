from rest_framework.permissions import BasePermission

from cop.core.models import Claim, Status


class AllowCurrentUsersPermission(BasePermission):
    def has_permission(self, request, view):
        current_claim = Claim.objects.get(id=view.kwargs['pk'])
        return request.user == current_claim.user


class AllowClaimMerchantPermission(BasePermission):
    def has_permission(self, request, view):
        current_claim = Claim.objects.get(id=view.kwargs['pk'])
        if current_claim.merchant:
            return request.user == current_claim.merchant.user
        else:
            return False


class AllowChbOffPermission(BasePermission):
    def has_permission(self, request, view):
        current_claim = Claim.objects.get(id=view.kwargs['pk'])
        if current_claim.chargeback_officer:
            return request.user == current_claim.chargeback_officer
        else:
            return False


class HasMerchantUpdatePermission(BasePermission):
    def has_permission(self, request, view):
        current_claim = Claim.objects.get(id=view.kwargs['pk'])
        if current_claim.status.stage in [Status.Stages.PRE_MEDIATION, Status.Stages.PRE_MEDIATION]:
            return True
        else:
            return False
