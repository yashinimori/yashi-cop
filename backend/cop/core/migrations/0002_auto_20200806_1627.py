# Generated by Django 3.0.8 on 2020-08-06 16:27

import django.contrib.postgres.fields.jsonb
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='claim',
            name='answers',
            field=django.contrib.postgres.fields.jsonb.JSONField(blank=True, max_length=999, null=True),
        ),
        migrations.AddField(
            model_name='claim',
            name='mediator',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='claim_mediators', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='claim',
            name='reason_code',
            field=models.CharField(blank=True, max_length=999, null=True),
        ),
        migrations.AlterField(
            model_name='claim',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='claim_users', to=settings.AUTH_USER_MODEL),
        ),
    ]