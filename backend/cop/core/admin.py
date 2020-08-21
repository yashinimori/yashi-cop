from django.contrib import admin

from cop.core.models import Claim, Merchant, Bank, Transaction, Terminal, Comment, SurveyQuestion, \
    ReasonCodeGroup, ClaimDocument, Report, BankEmployee, StageChangesHistory, Status


@admin.register(Bank)
class BankAdmin(admin.ModelAdmin):
    pass


@admin.register(Merchant)
class MerchantAdmin(admin.ModelAdmin):
    pass


@admin.register(Terminal)
class TerminalAdmin(admin.ModelAdmin):
    pass


@admin.register(Claim)
class ClaimAdmin(admin.ModelAdmin):
    pass


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    pass


@admin.register(StageChangesHistory)
class StageAdmin(admin.ModelAdmin):
    pass


@admin.register(Status)
class StageAdmin(admin.ModelAdmin):
    pass


@admin.register(ClaimDocument)
class ClaimDocumentAdmin(admin.ModelAdmin):
    pass


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    pass


@admin.register(SurveyQuestion)
class SurveyQuestionAdmin(admin.ModelAdmin):
    pass


@admin.register(ReasonCodeGroup)
class SurveyQuestionAdmin(admin.ModelAdmin):
    pass


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    pass


@admin.register(BankEmployee)
class ReportAdmin(admin.ModelAdmin):
    pass
