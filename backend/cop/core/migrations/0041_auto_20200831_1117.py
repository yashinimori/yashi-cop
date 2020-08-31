# Generated by Django 3.0.8 on 2020-08-31 11:17

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('core', '0040_auto_20200828_1344'),
    ]

    operations = [
        migrations.AlterField(
            model_name='claim',
            name='transaction',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL,
                                    related_name='transactions', to='core.Transaction'),
        ),
    ]
