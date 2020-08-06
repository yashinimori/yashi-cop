# Generated by Django 3.0.8 on 2020-08-06 11:08

from django.db import migrations, models

import cop.users.models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_auto_20200726_1007'),
    ]

    operations = [
        migrations.AlterModelManagers(
            name='user',
            managers=[
                ('objects', cop.users.models.UserManager()),
            ],
        ),
        migrations.RemoveField(
            model_name='user',
            name='username',
        ),
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(max_length=999, unique=True, verbose_name='email address'),
        ),
    ]
