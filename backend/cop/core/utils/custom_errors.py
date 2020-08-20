from rest_framework.exceptions import ValidationError


class RoleNotFound(ValidationError):
    status_code = 400
    default_detail = 'User role does not exist'
