from rest_framework import permissions


class BankPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_cop_manager
