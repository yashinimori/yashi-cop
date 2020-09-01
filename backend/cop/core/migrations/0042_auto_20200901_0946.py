# Generated by Django 3.0.8 on 2020-09-01 09:46

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0041_auto_20200831_1117'),
    ]

    operations = [
        migrations.AddField(
            model_name='stagechangeshistory',
            name='status_from',
            field=models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, related_name='history_status_from', to='core.Status'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='stagechangeshistory',
            name='status_to',
            field=models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, related_name='history_status_to', to='core.Status'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='claim',
            name='atm',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='core.ATM'),
        ),
    ]