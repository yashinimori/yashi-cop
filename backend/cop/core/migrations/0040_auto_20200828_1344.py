# Generated by Django 3.0.8 on 2020-08-28 13:44

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('core', '0039_auto_20200828_1243'),
    ]

    operations = [
        migrations.AlterField(
            model_name='claim',
            name='trans_approval_code',
            field=models.CharField(blank=True, max_length=6, null=True),
        ),
    ]