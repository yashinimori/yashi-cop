# Generated by Django 3.0.8 on 2020-08-12 12:06

import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('core', '0005_auto_20200811_1227'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='claim',
            name='bank_comments',
        ),
        migrations.RemoveField(
            model_name='claim',
            name='comment',
        ),
        migrations.RemoveField(
            model_name='claim',
            name='email',
        ),
        migrations.RemoveField(
            model_name='claim',
            name='first_name',
        ),
        migrations.RemoveField(
            model_name='claim',
            name='last_name',
        ),
        migrations.RemoveField(
            model_name='claim',
            name='telephone',
        ),
        migrations.RemoveField(
            model_name='comment',
            name='transaction',
        ),
        migrations.RemoveField(
            model_name='transaction',
            name='trans_amount',
        ),
        migrations.RemoveField(
            model_name='transaction',
            name='trans_currency',
        ),
        migrations.AddField(
            model_name='claim',
            name='bank_comments_a',
            field=models.ManyToManyField(blank=True, related_name='bank_comments_a', to='core.Comment'),
        ),
        migrations.AddField(
            model_name='claim',
            name='bank_comments_i',
            field=models.ManyToManyField(blank=True, related_name='bank_comments_i', to='core.Comment'),
        ),
        migrations.AddField(
            model_name='claim',
            name='merch_name_ips',
            field=models.CharField(blank=True, max_length=99, null=True),
        ),
        migrations.AddField(
            model_name='claim',
            name='trans_amount',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=12, null=True),
        ),
        migrations.AddField(
            model_name='claim',
            name='trans_approval_code',
            field=models.CharField(default=0, max_length=6),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='claim',
            name='trans_currency',
            field=models.CharField(choices=[('usd', 'дол. США'), ('eur', 'євро'), ('hrn', 'грн')], default='hrn', max_length=3),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='claim',
            name='trans_date',
            field=models.DateTimeField(default=django.utils.timezone.now, max_length=12),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='transaction',
            name='amount',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=12, null=True),
        ),
        migrations.AddField(
            model_name='transaction',
            name='currency',
            field=models.CharField(blank=True, choices=[('usd', 'дол. США'), ('eur', 'євро'), ('hrn', 'грн')], max_length=3, null=True),
        ),
        migrations.RemoveField(
            model_name='claim',
            name='ch_comments',
        ),
        migrations.AddField(
            model_name='claim',
            name='ch_comments',
            field=models.ManyToManyField(blank=True, related_name='ch_comments', to='core.Comment'),
        ),
        migrations.AlterField(
            model_name='claim',
            name='merch_id',
            field=models.CharField(blank=True, max_length=15, null=True),
        ),
        migrations.RemoveField(
            model_name='claim',
            name='merchant_comments',
        ),
        migrations.AddField(
            model_name='claim',
            name='merchant_comments',
            field=models.ManyToManyField(blank=True, related_name='merch_comments', to='core.Comment'),
        ),
        migrations.AlterField(
            model_name='claim',
            name='reason_code',
            field=models.CharField(blank=True, help_text='IPS code', max_length=999, null=True),
        ),
        migrations.AlterField(
            model_name='claim',
            name='reason_code_group',
            field=models.CharField(blank=True, help_text='Internal codes', max_length=99, null=True),
        ),
        migrations.AlterField(
            model_name='claim',
            name='term_id',
            field=models.CharField(blank=True, max_length=8, null=True),
        ),
        migrations.AlterField(
            model_name='comment',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='transaction',
            name='mcc',
            field=models.CharField(blank=True, max_length=4, null=True),
        ),
    ]
