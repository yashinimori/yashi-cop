# Generated by Django 3.0.8 on 2020-08-20 13:20

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('core', '0024_auto_20200818_0927'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='merchant',
            name='terminal_id',
        ),
        migrations.AddField(
            model_name='claim',
            name='chargeback_officer',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='claim_chargeback_officers', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='transaction',
            name='result',
            field=models.CharField(blank=True, choices=[('successful', 'Successful'), ('failed', 'Failed'), ('neutral', 'Neutral')], db_index=True, max_length=999, null=True),
        ),
        migrations.RenameModel(
            old_name='Stage',
            new_name='Status',
        ),
        migrations.CreateModel(
            name='StageChangesHistory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('create_date', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('update_date', models.DateTimeField(auto_now=True)),
                ('reason', models.CharField(default='Автоматично', max_length=999)),
                ('claim', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='stages', to='core.Claim')),
                ('status', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Status')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
