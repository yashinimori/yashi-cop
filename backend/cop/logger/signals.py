from django.contrib.auth.signals import user_logged_in, user_logged_out, user_login_failed
from django.dispatch import receiver
from django.utils import timezone

from cop.logger.models import LoggerEntry, LOGIN_SUCCESS, LOGOUT, LOGIN_FAILED


@receiver(user_logged_in)
def user_logged_in_callback(sender, request, user, **kwargs):
    # to cover more complex cases:
    # http://stackoverflow.com/questions/4581789/how-do-i-get-user-ip-address-in-django
    ip = request.META.get('REMOTE_ADDR')
    message = f'{user.full_name} with ID {user.id} successfully logged in at {timezone.now()}. ' \
              f'User IP: {ip}'

    LoggerEntry.objects.create(
        user=user,
        ip=ip,
        change_message=message,
        action_flag=LOGIN_SUCCESS
    )


@receiver(user_logged_out)
def user_logged_out_callback(sender, request, user, **kwargs):
    ip = request.META.get('REMOTE_ADDR')
    message = f'{user.full_name} with ID {user.id} logged out at {timezone.now()}. ' \
              f'User IP: {ip}'

    LoggerEntry.objects.create(
        user=user,
        ip=ip,
        change_message=message,
        action_flag=LOGOUT
    )


@receiver(user_login_failed)
def user_login_failed_callback(sender, credentials, request, **kwargs):
    # Can be used https://github.com/jazzband/django-axes
    ip = request.META.get('REMOTE_ADDR')
    message = f'WARNING! Failed login at {timezone.now()} credentials entered: {credentials}. User IP: {ip}'

    LoggerEntry.objects.create(
        ip=ip,
        change_message=message,
        action_flag=LOGIN_FAILED
    )
