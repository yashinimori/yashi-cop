# Generated by Django 3.0.8 on 2020-09-02 11:06

from django.conf import settings
import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('core', '0043_auto_20200901_1726'),
    ]

    operations = [
        migrations.AddField(
            model_name='claim',
            name='reminder_task_ids',
            field=django.contrib.postgres.fields.ArrayField(base_field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=32), size=None), blank=True, null=True, size=None),
        ),
        migrations.AddField(
            model_name='claim',
            name='replier',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='claim_repliers', to=settings.AUTH_USER_MODEL),
        ),
    ]