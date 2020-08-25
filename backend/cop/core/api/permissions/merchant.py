from rest_framework import permissions


# TODO add retrieve and list permissions
class MerchantPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return (view.action in ['create', 'update', 'partial_update', 'destroy']
                and request.user.is_cop_manager)
