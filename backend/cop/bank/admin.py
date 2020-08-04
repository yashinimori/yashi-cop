# django
from django.contrib import admin
from django.contrib.auth import get_user_model
from django.utils.safestring import mark_safe

# from bank.actions import parse_report_action
# my
from cop.bank.models import Report, Claim, ATM, Chargeback, ChargebackDetail, Transaction

User = get_user_model()


class ReportAdmin(admin.ModelAdmin):
    list_display = ('id', 'log', 'log_hash', 'status')
    list_filter = ('status', )
    # actions = (parse_report_action, )


class TransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'chb_date', 'trans_date', 'atm', 'pan', 'trans_amount', 'currency',
                    'disp_amount', 'auth_code', 'result', 'utrnno', 'report', 'magazine')
    list_filter = ('currency', 'result', 'atm')

    date_hierarchy = 'create_date'

    def magazine(self, obj):
        parts = []
        for i in range(4):
            value = getattr(obj, f'magazine{i + 1}_amount')
            parts.append(f'{i + 1}: {value}')

        return mark_safe("<br />".join(parts))
    magazine.allow_tags = True


class ClaimAdmin(admin.ModelAdmin):
    list_display = ('id', 'claim_id', 'transaction_id', 'claim_value')


class AMTAdmin(admin.ModelAdmin):
    list_display = ('id', 'uid', 'magazine1_amount', 'magazine2_amount', 'magazine3_amount', 'magazine4_amount')


# admin.site.unregister(User)
# admin.site.register(User, UserAdmin)
admin.site.register(Report, ReportAdmin)
admin.site.register(Transaction, TransactionAdmin)
admin.site.register(Claim, ClaimAdmin)
admin.site.register(ATM, AMTAdmin)
admin.site.register(Chargeback)
admin.site.register(ChargebackDetail)
