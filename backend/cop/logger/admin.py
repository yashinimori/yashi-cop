from django.contrib import admin

from cop.logger.models import LoggerEntry


@admin.register(LoggerEntry)
class LoggerEntry(admin.ModelAdmin):
    pass
