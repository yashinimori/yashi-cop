# Generated by Django 3.0.8 on 2020-08-11 12:28

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_auto_20200806_1108'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='claim_fields',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=128), blank=True, help_text='Available fields: id, update_date, acquirer_id, acquirer_ref_num, primary_account_num, claim_id, clearing_due_date, clearing_network, due_date, is_accurate, is_acquirer, is_issuer, is_open, issuer_id, last_modified_by, last_modified_date, merchant_id, progress_state, claim_value, queue_name, create_date, transaction_id, claim_type, ', null=True, size=None),
        ),
    ]