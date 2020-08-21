from rest_framework import permissions

from cop.core.models import Claim


class AllowCurrentUsersPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        current_claim = Claim.objects.get(id=view.kwargs['pk'])
        return request.user == current_claim.user


class AllowClaimMerchantPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        current_claim = Claim.objects.get(id=view.kwargs['pk'])
        if current_claim.merchant:
            return request.user == current_claim.merchant.user
        else:
            return False


class AllowChbOffPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        current_claim = Claim.objects.get(id=view.kwargs['pk'])
        if current_claim.chargeback_officer:
            return request.user == current_claim.chargeback_officer
        else:
            return False
