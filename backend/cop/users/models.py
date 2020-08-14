from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField
from django.db.models import CharField, EmailField, DateField
from django.urls import reverse
from django.utils.translation import gettext_lazy as _

from cop.bank.models import Claim


def get_claim_field_help_text():
    claim_fields_lst = Claim._meta.fields
    claim_fields_help_test = 'Available fields: '
    for i in claim_fields_lst:
        claim_fields_help_test += f'{i.get_attname()}, '
    return claim_fields_help_test


class UserManager(BaseUserManager):
    """Define a model manager for User model with no username field."""

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular User with the given email and password."""
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)


class User(AbstractUser):
    """Default user for cop.
    """
    TOP_LEVEL = 'top_level'
    SECURITY_OFFICER = 'security_officer'
    COP_MANAGER = 'cop_manager'
    CARDHOLDER = 'cardholder'
    CHARGEBACK_OFFICER = 'chargeback_officer'
    MERCHANT = 'merchant'
    СС_BRANCH = 'сс_branch'
    ROLES = (
        (TOP_LEVEL, 'Top level'),
        (SECURITY_OFFICER, 'Security officer'),
        (COP_MANAGER, 'COP manager'),
        (CARDHOLDER, 'Cardholder'),
        (CHARGEBACK_OFFICER, 'Chargeback officer'),
        (MERCHANT, 'Merchant'),
        (СС_BRANCH, 'сс/branch'),
    )
    username = None
    #: First and last name do not cover name patterns around the globe
    first_name = CharField(_("First name of User"), max_length=999)
    last_name = CharField(_("Last name of User"), max_length=999)
    role = CharField(max_length=999, choices=ROLES)
    unit = CharField(max_length=200, null=True, blank=True)
    phone = CharField(max_length=13)
    email = EmailField(_('email address'), unique=True, max_length=999)
    claim_fields = ArrayField(CharField(max_length=128), blank=True, null=True, help_text=get_claim_field_help_text())
    registration_date = DateField(auto_now_add=True, editable=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def get_absolute_url(self):
        """Get url for user's detail view.

        Returns:
            str: URL for user detail.

        """
        return reverse("users:detail", kwargs={"username": self.username})

    def __str__(self):
        return self.email
