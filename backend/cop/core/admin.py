from django.contrib import admin

from cop.core.models import Claim, Merchant, Bank, Transaction, Stage, Document, Terminal, Comment, SurveyQuestion


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


@admin.register(Stage)
class StageAdmin(admin.ModelAdmin):
    pass


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    pass


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    pass


@admin.register(SurveyQuestion)
class SurveyQuestionAdmin(admin.ModelAdmin):
    pass
