# Generated by Django 3.0.8 on 2020-08-21 09:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0027_auto_20200821_0933'),
    ]

    operations = [
        migrations.AlterField(
            model_name='terminal',
            name='merchant',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='terminals', to='core.Merchant'),
        ),
    ]