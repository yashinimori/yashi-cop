# Generated by Django 2.1.7 on 2019-06-14 12:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bank', '0012_auto_20190527_0919'),
    ]

    operations = [
        migrations.AddField(
            model_name='report',
            name='error',
            field=models.TextField(blank=True, null=True),
        ),
    ]