# Generated by Django 3.0.8 on 2020-08-04 16:53

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Bank',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('create_date', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('update_date', models.DateTimeField(auto_now=True)),
                ('bin', models.CharField(max_length=8)),
                ('type', models.CharField(choices=[('ACQ', 'ACQ'), ('ISS', 'ISS'), ('BOTH', 'BOTH')], max_length=4)),
                ('name_eng', models.CharField(max_length=999)),
                ('name_uk', models.CharField(max_length=999)),
                ('name_rus', models.CharField(max_length=999)),
                ('operator_name', models.CharField(max_length=999)),
                ('contact_person', models.CharField(max_length=999)),
                ('contact_telephone', models.CharField(max_length=999)),
                ('contact_email', models.EmailField(max_length=999)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Claim',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('create_date', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('update_date', models.DateTimeField(auto_now=True)),
                ('first_name', models.CharField(blank=True, max_length=999, null=True)),
                ('last_name', models.CharField(blank=True, max_length=999, null=True)),
                ('email', models.CharField(blank=True, max_length=999, null=True)),
                ('telephone', models.CharField(blank=True, max_length=999, null=True)),
                ('source', models.CharField(blank=True, max_length=999, null=True)),
                ('arn', models.CharField(blank=True, max_length=23, null=True)),
                ('flag', models.CharField(blank=True, max_length=999, null=True)),
                ('reason_code_group', models.CharField(blank=True, max_length=23, null=True)),
                ('action_needed', models.CharField(max_length=999)),
                ('comment', models.TextField(blank=True, null=True)),
                ('result', models.CharField(blank=True, choices=[('successful', 'Successful'), ('failed', 'Failed'), ('neutral', 'Neutral')], max_length=999, null=True)),
                ('support', models.CharField(blank=True, choices=[('one_them_chargeback', 'One them chargebacks'), ('on_us_chargeback', 'On us chargeback'), ('us_on_us', 'Us on us'), ('fraud', 'Fraud')], max_length=999, null=True)),
                ('due_date', models.DateTimeField(blank=True, null=True)),
                ('dispute_date', models.DateTimeField(blank=True, null=True)),
                ('bank', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='core.Bank')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Merchant',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('create_date', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('update_date', models.DateTimeField(auto_now=True)),
                ('merchant_id', models.CharField(max_length=15)),
                ('merchant_name_legal', models.CharField(max_length=999)),
                ('mcc', models.CharField(max_length=4)),
                ('description', models.CharField(max_length=999)),
                ('telephone', models.CharField(max_length=13)),
                ('email', models.EmailField(max_length=999)),
                ('merchant_name_ips', models.CharField(max_length=999)),
                ('address', models.CharField(max_length=999)),
                ('terminal_id', models.CharField(max_length=8)),
                ('contact_person', models.CharField(max_length=999)),
                ('bank', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='core.Bank')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Stage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('create_date', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('update_date', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=999)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Terminal',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('create_date', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('update_date', models.DateTimeField(auto_now=True)),
                ('terminal_id', models.CharField(max_length=999)),
                ('merchant', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='core.Merchant')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('create_date', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('update_date', models.DateTimeField(auto_now=True)),
                ('pan', models.CharField(blank=True, max_length=16, null=True)),
                ('trans_amount', models.DecimalField(blank=True, decimal_places=2, max_digits=20, null=True)),
                ('trans_currency', models.CharField(blank=True, max_length=3, null=True)),
                ('auth_code', models.CharField(blank=True, max_length=6, null=True)),
                ('approval_code', models.CharField(blank=True, max_length=6, null=True)),
                ('cash_count', models.CharField(blank=True, max_length=999, null=True)),
                ('error', models.CharField(blank=True, max_length=999, null=True)),
                ('result', models.CharField(blank=True, max_length=999, null=True)),
                ('trans_start', models.DateTimeField(blank=True, max_length=12, null=True)),
                ('trans_end', models.DateTimeField(blank=True, max_length=12, null=True)),
                ('pin_entered', models.DateTimeField(blank=True, max_length=12, null=True)),
                ('cash_request', models.DateTimeField(blank=True, max_length=12, null=True)),
                ('cash_presented', models.DateTimeField(blank=True, max_length=12, null=True)),
                ('cash_retracted', models.DateTimeField(blank=True, max_length=12, null=True)),
                ('cash_taken', models.DateTimeField(blank=True, max_length=12, null=True)),
                ('card_taken', models.DateTimeField(blank=True, max_length=12, null=True)),
                ('bank', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='core.Bank')),
                ('merchant', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='core.Merchant')),
                ('terminal', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='core.Terminal')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Document',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('create_date', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('update_date', models.DateTimeField(auto_now=True)),
                ('description', models.CharField(blank=True, max_length=255)),
                ('document', models.FileField(upload_to='documents/')),
                ('transaction', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='documents', to='core.Claim')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('create_date', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('update_date', models.DateTimeField(auto_now=True)),
                ('text', models.TextField()),
                ('transaction', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='core.Claim')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='claim',
            name='merchant',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='core.Merchant'),
        ),
        migrations.AddField(
            model_name='claim',
            name='stage',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='core.Stage'),
        ),
        migrations.AddField(
            model_name='claim',
            name='terminal',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='core.Terminal'),
        ),
        migrations.AddField(
            model_name='claim',
            name='transaction',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='core.Transaction'),
        ),
        migrations.AddField(
            model_name='claim',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]