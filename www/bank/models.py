# common
import hashlib

# django
from django.db import models
from django.dispatch import receiver
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model

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
    status = models.CharField(choices=STATUSSES, max_length=100, db_index=True, default=STATUSSES[0][0])
    log_hash = models.CharField(unique=True, max_length=256, db_index=True, null=True, blank=True)

    def __str__(self):
        return f'Report: {self.status}'

    def clean(self):
        log_hash = generate_sha256(self.log.file)
        query = Report.objects.filter(log_hash=log_hash)
        if self.pk:
            query = query.exclude(pk=self.pk)
        count = len(query)
        if count:
            raise ValidationError('This file is allready exists')

        self.log_hash = log_hash


def generate_sha256(file):
	sha = hashlib.sha256()
	file.seek(0)
	while True:
		buf = file.read(104857600)
		if not buf:
			break
		sha.update(buf)
	sha256 = sha.hexdigest()
	file.seek(0)

	return sha256


class Transaction(BaseModel):
    RESULTS = (
        ('successful', 'Successful'),
        ('failed', 'Failed'),
        ('neutral', 'Neutral'),
    )

    STATUSSES = (
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
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

    comment = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, null=True, blank=True, choices=STATUSSES)

    class Meta():
        index_together = (
            ('utrnno', 'report'),
        )

    def __str__(self):
        return f"{self.trans_date}, {self.currency}, {self.disp_amount}, {self.result} "


@receiver(models.signals.post_save, sender=Report)
def save_report_event(sender, instance, created, **kwargs):
    if created:
        process_report_task.apply_async(args=(instance.id, ))


class UserProfile(BaseModel):
    CATEGORIES = (
        ('test', 'Test'),
        ('dispute', 'Dispute'),
        ('administrative', 'Administrative'),
    )
    user = models.OneToOneField(get_user_model(), on_delete=models.CASCADE)
    category = models.CharField(max_length=100, choices=CATEGORIES, null=True, blank=True)
    position = models.CharField(max_length=100, null=True, blank=True)
    organization = models.CharField(max_length=100, null=True, blank=True)
    phone = models.CharField(max_length=50, null=True, blank=True)
    email = models.EmailField(max_length=200, null=True, blank=True)


@receiver(models.signals.post_save, sender=get_user_model())
def create_user_profile_event(sender, instance, created, **kwargs):
    if created:        
        user_profile = UserProfile.objects.create(user=instance)
        assert user_profile
