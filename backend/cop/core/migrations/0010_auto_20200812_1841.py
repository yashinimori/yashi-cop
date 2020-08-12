# Generated by Django 3.0.8 on 2020-08-12 18:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0009_auto_20200812_1835'),
    ]

    operations = [
        migrations.AlterField(
            model_name='claim',
            name='stage',
            field=models.CharField(choices=[('pre_mediation', 'pre_mediation'), ('mediation', 'mediation'), ('chargeback', 'chargeback'), ('chargeback_escalation', 'chargeback_escalation'), ('dispute', 'dispute'), ('dispute_response', 'dispute_response'), ('pre_arbitration', 'pre_arbitration'), ('pre_arbitration_response', 'pre_arbitration_response'), ('arbitration', 'arbitration'), ('final_ruling', 'final_ruling')], default='pre_mediation', max_length=999),
        ),
    ]
