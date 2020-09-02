from django.contrib.auth import get_user_model
from rest_framework import permissions

User = get_user_model()


class AllowChargebackOfficerPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_chargeback_officer


class AllowCopManagerPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_cop_manager


class AllowBankEmployeesPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role in [User.Roles.COP_MANAGER, User.Roles.TOP_LEVEL, User.Roles.CHARGEBACK_OFFICER]
