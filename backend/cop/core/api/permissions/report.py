from rest_framework import permissions

# TODO find out who can create report
class CreateReportPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_chargeback_officer
