# Generated by Django 3.0.8 on 2021-04-26 15:10

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('core', '0011_auto_20210422_1253'),
    ]

    operations = [
        migrations.AlterField(
            model_name='claim',
            name='chargeback_officer',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='claim_chargeback_officers', to=settings.AUTH_USER_MODEL),
        ),
    ]
