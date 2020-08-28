# Generated by Django 3.0.8 on 2020-08-25 11:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0033_claim_officer_answer_reason'),
    ]

    operations = [
        migrations.AlterField(
            model_name='claim',
            name='form_name',
            field=models.CharField(blank=True, choices=[('escalate_form', 'escalate_form'), ('close_form', 'close_form'), ('clarify_form', 'clarify_form'), ('query_form', 'query_form'), ('survey_form', 'survey_form')], max_length=32, null=True),
        ),
    ]