from django.db import transaction
from django.db.models.signals import post_save
from django.dispatch import receiver

from cop.core.models import Report


@receiver(post_save, sender=Report)
def save_report_event(sender, instance, created, **kwargs):
    from .tasks import process_report_task
    if created:
        transaction.on_commit(lambda: process_report_task.delay(instance.id,))
