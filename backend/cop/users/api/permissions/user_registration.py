from django.contrib.auth import get_user_model
from rest_framework import permissions

User = get_user_model()


class UserRegistrationPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        req_user = request.user
        role = request.data.get('role')

        if request.method == 'POST':

            if not req_user.is_authenticated and role == User.Roles.CARDHOLDER:
                return True

            if req_user.is_authenticated and req_user.is_cop_manager:
                return True

            if req_user.is_authenticated and req_user.is_top_level and role == User.Roles.SECURITY_OFFICER:
                return True

            if req_user.is_authenticated and req_user.is_security_officer and \
                    role in [User.Roles.TOP_LEVEL, User.Roles.CHARGEBACK_OFFICER, User.Roles.CC_BRANCH]:
                return True

            return False
