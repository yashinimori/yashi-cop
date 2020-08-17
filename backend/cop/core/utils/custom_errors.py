from rest_framework.exceptions import ValidationError


class RoleNotFound(ValidationError):
    def __str__(self):
        return "User role dasn't found"
