# Generated by Django 2.1.1 on 2018-09-27 04:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('bank', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Report',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('create_date', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('update_date', models.DateTimeField(auto_now=True)),
                ('log', models.FileField(upload_to='logs/%Y/%m/%d/')),
                ('status', models.CharField(choices=[('new', 'New'), ('error', 'Error'), ('finished', 'Finished')], db_index=True, max_length=100)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AlterField(
            model_name='transaction',
            name='result',
            field=models.CharField(choices=[('successful', 'Successful'), ('atm_no_resp', 'ATM no response'), ('dispense_error', 'Dispense error')], db_index=True, max_length=100),
        ),
        migrations.AddField(
            model_name='transaction',
            name='report',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='bank.Report'),
        ),
    ]
