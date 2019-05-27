# django
from django.contrib import admin
from django.contrib.auth import get_user_model

# my
from bank.models import Transaction, Report, UserProfile, Claim
from bank.actions import parse_report_action


User = get_user_model()


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'User profile'
    fk_name = 'user'


class UserAdmin(admin.ModelAdmin):
    inlines = (UserProfileInline, )

    list_display = ('id', 'username', 'email', 'full_name', 'is_staff', 'date_joined', )
    search_fields = ('username', 'first_name', 'last_name', 'email')

    def get_formsets_with_inlines(self, request, obj=None):
        if not obj:
            return []
        return super().get_formsets_with_inlines(request, obj)

    def full_name(self, obj):
        parts = []
        if obj.first_name:
            parts.append(obj.first_name)
        if obj.last_name:
            parts.append(obj.last_name)
        return " ".join(parts)


class ReportAdmin(admin.ModelAdmin):
    list_display = ('id', 'log', 'log_hash', 'status')
    list_filter = ('status', )
    actions = (parse_report_action, )


class TransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'chb_date', 'trans_date', 'atm', 'pan', 'trans_amount', 'currency', 
                    'disp_amount', 'auth_code', 'result', 'utrnno', 'report')
    list_filter = ('currency', 'result')

    date_hierarchy = 'create_date'


class ClaimAdmin(admin.ModelAdmin):
    list_display = ('id', 'claim_id', 'transaction_id', 'claim_value')


admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(Report, ReportAdmin)
admin.site.register(Transaction, TransactionAdmin)
admin.site.register(Claim, ClaimAdmin)
