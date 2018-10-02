# django
from django.db import models
from django.dispatch import receiver

# my
from bank.tasks import process_report_task


class BaseModel(models.Model):
    create_date = models.DateTimeField(auto_now_add=True, db_index=True)
    update_date = models.DateTimeField(auto_now=True)

    class Meta(object):
        abstract = True


class Report(BaseModel):
    STATUSSES = (
        ('new', 'New'),
        ('error', 'Error'),
        ('finished', 'Finished'),
    )
    log = models.FileField(upload_to='logs/%Y/%m/%d/')
    status = models.CharField(choices=STATUSSES, max_length=100, db_index=True)

    def __str__(self):
        return f'Rerpot: {self.status}'


class Transaction(BaseModel):
    RESULTS = (
        ('successful', 'Successful'),
        ('failed', 'Failed'),
        ('neutral', 'Neutral'),
    )

    chb_date = models.DateTimeField(null=True, blank=True)
    trans_date = models.DateTimeField(null=True, blank=True)
    atm = models.CharField(max_length=100, null=True, blank=True)
    pan = models.CharField(max_length=100, null=True, blank=True)
    trans_amount = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True)
    currency = models.CharField(max_length=20, null=True, blank=True)
    disp_amount = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True)
    auth_code = models.CharField(max_length=100, null=True, blank=True)
    result = models.CharField(choices=RESULTS, max_length=100, db_index=True, null=True, blank=True)
    card = models.CharField(max_length=100, null=True, blank=True)
    utrnno = models.CharField(max_length=100, null=True, blank=True, db_index=True)

    raw = models.TextField(null=True)

    report = models.ForeignKey(Report, on_delete=models.CASCADE, null=True)

    class Meta():
        index_together = (
            ('utrnno', 'report'),
        )

    def __str__(self):
        return f"{self.trans_date}, {self.currency}, {self.disp_amount}, {self.result} "


@receiver(models.signals.post_save, sender=Report)
def save_report_event(sender, instance, created, **kwargs):
    if created:
        process_report_task.apply_async(args=(sender.id, ))