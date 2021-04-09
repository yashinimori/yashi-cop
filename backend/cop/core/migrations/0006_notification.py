# Generated by Django 3.0.8 on 2021-04-06 14:16

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_auto_20210330_0959'),
    ]

    operations = [
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('create_date', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('update_date', models.DateTimeField(auto_now=True)),
                ('text', models.CharField(max_length=999)),
                ('is_active', models.BooleanField(default=True)),
                ('claim', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notifications', to='core.Claim')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]