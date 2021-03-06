from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.urls import reverse
from django.utils.translation import gettext_lazy as _


def get_claim_default_display_fields():
    return [
        'id', 'pan', 'trans_date', 'term_id', 'terminal',
        'merchant', 'merch_id', 'merch_name_ips', 'trans_amount', 'trans_currency',
        'trans_approval_code', 'claim_reason_code', 'status', 'result', 'due_date', 'action_needed'
    ]


class BaseModel(models.Model):
    create_date = models.DateTimeField(auto_now_add=True, db_index=True)
    update_date = models.DateTimeField(auto_now=True)

    class Meta(object):
        abstract = True


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

    class Roles:
        TOP_LEVEL = 'top_level'
        SECURITY_OFFICER = 'security_officer'
        COP_MANAGER = 'cop_manager'
        CARDHOLDER = 'cardholder'
        CHARGEBACK_OFFICER = 'chargeback_officer'
        MERCHANT = 'merchant'
        CC_BRANCH = '????_branch'
        CHOICES = (
            (TOP_LEVEL, 'Top level'),
            (SECURITY_OFFICER, 'Security officer'),
            (COP_MANAGER, 'COP manager'),
            (CARDHOLDER, 'Cardholder'),
            (CHARGEBACK_OFFICER, 'Chargeback officer'),
            (MERCHANT, 'Merchant'),
            (CC_BRANCH, '????/branch'),
        )

    username = None
    #: First and last name do not cover name patterns around the globe
    created_by = models.ForeignKey("self", null=True, blank=True, on_delete=models.SET_NULL)
    first_name = models.CharField(_("First name of User"), max_length=999)
    last_name = models.CharField(_("Last name of User"), max_length=999)
    role = models.CharField(max_length=999, choices=Roles.CHOICES)
    phone = models.CharField(max_length=13)
    password_change_required = models.BooleanField(default=False)
    email = models.EmailField(_('email address'), unique=True, max_length=999)
    displayable_claim_fields = ArrayField(models.CharField(max_length=128), default=get_claim_default_display_fields)
    registration_date = models.DateField(auto_now_add=True, editable=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def get_absolute_url(self):
        """Get url for user's detail view.

        Returns:
            str: URL for user detail.

        """
        return reverse("users:detail", kwargs={"username": self.username})

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def is_top_level(self):
        return self.role == self.Roles.TOP_LEVEL

    @property
    def is_security_officer(self):
        return self.role == self.Roles.SECURITY_OFFICER

    @property
    def is_cop_manager(self):
        return self.role == self.Roles.COP_MANAGER

    @property
    def is_cardholder(self):
        return self.role == self.Roles.CARDHOLDER

    @property
    def is_chargeback_officer(self):
        return self.role == self.Roles.CHARGEBACK_OFFICER

    @property
    def is_merchant(self):
        return self.role == self.Roles.MERCHANT

    @property
    def is_cc_branch(self):
        return self.role == self.Roles.CC_BRANCH

    def __str__(self):
        return self.email


class Merchant(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bank = models.ManyToManyField('core.Bank', blank=True)
    merch_id = models.CharField(max_length=15, unique=True)
    name_legal = models.CharField(max_length=999, blank=True, null=True)
    bin = models.CharField(max_length=999, blank=True, null=True)
    name_ips = models.CharField(max_length=999)
    mcc = models.CharField(max_length=4, blank=True, null=True)
    description = models.CharField(max_length=999, blank=True, null=True)
    address = models.CharField(max_length=999, blank=True, null=True)
    contact_person = models.CharField(max_length=999, blank=True, null=True)

    def __str__(self):
        return self.name_ips


class BankEmployee(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bank = models.ForeignKey('core.Bank', on_delete=models.CASCADE, related_name="employee_banks")
    unit = models.CharField(max_length=200, null=True, blank=True)
    atm = models.ManyToManyField('core.ATM', related_name='bank_employees')

    def __str__(self):
        return f"{self.bank} {self.user}"
