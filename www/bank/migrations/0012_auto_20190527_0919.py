# Generated by Django 2.1.7 on 2019-05-27 09:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bank', '0011_auto_20190508_0834'),
    ]

    operations = [
        migrations.CreateModel(
            name='Claim',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('update_date', models.DateTimeField(auto_now=True)),
                ('acquirer_id', models.CharField(max_length=100)),
                ('acquirer_ref_num', models.CharField(max_length=200)),
                ('primary_account_num', models.CharField(max_length=100)),
                ('claim_id', models.CharField(max_length=100, unique=True)),
                ('clearing_due_date', models.DateField()),
                ('clearing_network', models.CharField(max_length=20)),
                ('due_date', models.DateField()),
                ('is_accurate', models.BooleanField()),
                ('is_acquirer', models.BooleanField()),
                ('is_issuer', models.BooleanField()),
                ('is_open', models.BooleanField()),
                ('issuer_id', models.CharField(max_length=100)),
                ('last_modified_by', models.CharField(max_length=100)),
                ('last_modified_date', models.DateTimeField()),
                ('merchant_id', models.CharField(max_length=100)),
                ('progress_state', models.CharField(max_length=100)),
                ('claim_value', models.CharField(max_length=100)),
                ('queue_name', models.CharField(max_length=100)),
                ('create_date', models.DateField()),
                ('transaction_id', models.CharField(max_length=100)),
                ('claim_type', models.CharField(max_length=100)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AlterField(
            model_name='transaction',
            name='status',
            field=models.CharField(blank=True, choices=[('accepted', 'Accepted'), ('declined', 'Declined'), ('pended', 'Pended')], max_length=20, null=True),
        ),
    ]
