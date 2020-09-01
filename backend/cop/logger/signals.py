import inspect

from django.contrib.auth import get_user_model
from django.contrib.auth.signals import user_logged_in
from django.contrib.contenttypes.models import ContentType
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils import timezone

from cop.core.models import Claim, Terminal, Bank, BankEmployee, Merchant, ATM, Transaction, ReasonCodeGroup, Comment, \
    Status, Report
from cop.logger.models import LoggerEntry, LOGIN_SUCCESS, CHANGE, DELETION, ADDITION

User = get_user_model()


def get_user_data():
    for frame_record in inspect.stack():
        if frame_record[3] == 'get_response':
            request = frame_record[0].f_locals['request']
            return {
                'user': request.user,
                'ip': request.META.get('REMOTE_ADDR')
            }


def get_change_or_create_flag(created):
    return ADDITION if created else CHANGE


def action_is_token_create(update_fields):
    if update_fields:
        update_fields = [*_] = update_fields
        if 'last_login' in update_fields:
            return True


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


# @receiver(user_login_failed)
# def user_login_failed_callback(sender, credentials, request, **kwargs):
#     # Can be used https://github.com/jazzband/django-axes
#     ip = request.META.get('REMOTE_ADDR')
#     message = f'WARNING! Failed login at {timezone.now()} credentials entered: {credentials}. User IP: {ip}'
#
#     transaction.on_commit(
#         LoggerEntry.objects.create(
#             user=User.objects.first(),
#             ip=ip,
#             change_message=message,
#             action_flag=LOGIN_FAILED
#         )
#     )


@receiver(post_save, sender=User)
@receiver(post_save, sender=Bank)
@receiver(post_save, sender=BankEmployee)
@receiver(post_save, sender=Merchant)
@receiver(post_save, sender=ATM)
@receiver(post_save, sender=Terminal)
@receiver(post_save, sender=Transaction)
@receiver(post_save, sender=ReasonCodeGroup)
@receiver(post_save, sender=Comment)
@receiver(post_save, sender=Status)
@receiver(post_save, sender=Report)
@receiver(post_save, sender=Claim)
def save_user_action(sender, instance, created, **kwargs):
    if action_is_token_create(kwargs['update_fields']):
        return

    content_type = ContentType.objects.get_for_model(sender)
    user_data = get_user_data()

    if user_data:
        if user_data["user"].id is None:
            message = f'Anonymous user {"created" if created else "changed"} {sender.__name__} with ID {instance.id}  {timezone.now()}. ' \
                      f'User IP: {user_data["ip"]}'
            LoggerEntry.objects.create(
                content_type=content_type,
                object_id=instance.id,
                ip=user_data["ip"],
                change_message=message,
                action_flag=get_change_or_create_flag(created)
            )
        else:
            message = f'{user_data["user"].full_name} user with ID {user_data["user"].id} {"created" if created else "changed"} {sender.__name__} with ID {instance.id}  {timezone.now()}. ' \
                      f'User IP: {user_data["ip"]}'
            LoggerEntry.objects.create(
                content_type=content_type,
                object_id=instance.id,
                user=user_data["user"],
                ip=user_data["ip"],
                change_message=message,
                action_flag=get_change_or_create_flag(created)
            )


@receiver(post_delete, sender=User)
@receiver(post_delete, sender=Bank)
@receiver(post_delete, sender=BankEmployee)
@receiver(post_delete, sender=Merchant)
@receiver(post_delete, sender=ATM)
@receiver(post_delete, sender=Terminal)
@receiver(post_delete, sender=Transaction)
@receiver(post_delete, sender=ReasonCodeGroup)
@receiver(post_delete, sender=Comment)
@receiver(post_delete, sender=Status)
@receiver(post_delete, sender=Report)
@receiver(post_delete, sender=Claim)
def save_user_deletion(sender, instance, using, **kwargs):
    user_data = get_user_data()
    message = f'{user_data["user"].full_name} user with ID {user_data["user"].id} deleted {sender.__name__} with ID {instance.id}  {timezone.now()}. ' \
              f'User IP: {user_data["ip"]}'
    content_type = ContentType.objects.get_for_model(sender)

    LoggerEntry.objects.create(
        content_type=content_type,
        object_id=instance.id,
        user=user_data["user"],
        ip=user_data["ip"],
        change_message=message,
        action_flag=DELETION
    )
