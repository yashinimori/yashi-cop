from django.conf import settings
from django.core.mail import send_mail

from cop.core.models import Claim


def send_expiration_notification(file_url: str, receiver_email):
    send_mail("File will be deleted soon",
              f"You can download file here: {file_url}. File will be deleted in 7 days.",
              settings.DJANGO_DEFAULT_FROM_EMAIL, [receiver_email.user.email])


def send_claim_notification(claim: Claim, receiver_email):
    send_mail(f"Claim {claim.id} is awaiting for your response",
              f"Claim will be automatically archived at {claim.due_date}",
              settings.DJANGO_DEFAULT_FROM_EMAIL, [receiver_email.user.email])
