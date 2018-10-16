# django
from django.contrib import admin

# my
from bank.models import Transaction, Report
from bank.actions import parse_report_action


class ReportAdmin(admin.ModelAdmin):
    list_display = ('id', 'log', 'log_hash', 'status')
    list_filter = ('status', )
    actions = (parse_report_action, )


class TransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'chb_date', 'trans_date', 'atm', 'pan', 'trans_amount', 'currency', 
                    'disp_amount', 'auth_code', 'result', 'utrnno', 'report')
    list_filter = ('currency', 'result')

    date_hierarchy = 'create_date'


admin.site.register(Report, ReportAdmin)
admin.site.register(Transaction, TransactionAdmin)
