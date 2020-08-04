from django.contrib.auth.models import AbstractUser
from django.db.models import CharField, EmailField, DateField
from django.urls import reverse
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    """Default user for cop.
    """
    ROLES = (
        ('top_level', 'Top level'),
        ('security_officer', 'Security officer'),
        ('cop_manager', 'COP manager'),
        ('chargeback_officer', 'Chargeback officer'),
        ('сс_branch', 'сс/branch'),
        ('merchant', 'Merchant'),
        ('cardholder', 'Cardholder'),
    )
    #: First and last name do not cover name patterns around the globe
    first_name = CharField(_("First name of User"), max_length=999)
    last_name = CharField(_("Last name of User"), max_length=999)
    role = CharField(max_length=999, choices=ROLES)
    unit = CharField(max_length=200, null=True, blank=True)
    phone = CharField(max_length=13)
    email = EmailField(max_length=999)
    registration_date = DateField(auto_now_add=True, editable=False)

    def get_absolute_url(self):
        """Get url for user's detail view.

        Returns:
            str: URL for user detail.

        """
        return reverse("users:detail", kwargs={"username": self.username})
