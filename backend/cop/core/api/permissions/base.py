from rest_framework import permissions


class ChargebackOfficerOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_chargeback_officer
