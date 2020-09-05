from rest_framework import permissions


class BankPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if view.action == 'list':
            return user.is_top_level or \
                   user.is_security_officer or user.is_cop_manager
        return request.user.is_cop_manager
