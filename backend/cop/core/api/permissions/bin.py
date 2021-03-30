from rest_framework import permissions


class BinPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return user.is_cop_manager or user.is_top_level
