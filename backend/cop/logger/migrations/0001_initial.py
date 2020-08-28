# Generated by Django 3.0.8 on 2020-08-28 08:44

import django.utils.timezone
from django.conf import settings
from django.db import migrations, models

import cop.logger.models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('contenttypes', '0002_remove_content_type_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='LoggerEntry',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('action_time',
                 models.DateTimeField(default=django.utils.timezone.now, editable=False, verbose_name='action time')),
                ('object_id', models.TextField(blank=True, null=True, verbose_name='object id')),
                ('object_repr', models.CharField(max_length=200, verbose_name='object repr')),
                ('action_flag', models.PositiveSmallIntegerField(
                    choices=[(1, 'Addition'), (2, 'Change'), (3, 'Deletion'), (4, 'Logged in'), (5, 'Login FAILED'),
                             (6, 'Logout')], verbose_name='action flag')),
                ('change_message', models.TextField(blank=True, verbose_name='change message')),
                ('ip', models.GenericIPAddressField(null=True)),
                ('content_type', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL,
                                                   to='contenttypes.ContentType', verbose_name='content type')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL,
                                           verbose_name='user')),
            ],
            options={
                'verbose_name': 'log entry',
                'verbose_name_plural': 'log entries',
                'ordering': ('-action_time',),
            },
            managers=[
                ('objects', cop.logger.models.LoggerEntryManager()),
            ],
        ),
    ]