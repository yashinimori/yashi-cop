# my
from bank.tasks import process_report_task


def parse_report_action(modeladmin, request, queryset):
    for instance in queryset:
        process_report_task.apply_async(args=(instance.id, ))
