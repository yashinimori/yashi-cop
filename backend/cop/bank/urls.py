from django.contrib.auth.views import PasswordChangeView
from django.urls import path

from cop.bank.views import TransactionsView, ReportsView, ViewTransactionView, UploadReportView, \
    AcceptedView, DeclinedView, ActionView, SettingsView, ViewTransactionPdf, IncomingChargebacksView, \
    DeclineChargeback, ChargebackDetailDeclineView, TransactionsApiSearchView, ChargebackDetailPendView, \
    ChargebackDetailAcceptView, FinancialReportView

urlpatterns = [
    path('', TransactionsView.as_view(), name='home'),
    path('transaction/<pk>/view', ViewTransactionView.as_view(), name='transaction_view'),
    path('transaction/<pk>/pdf', ViewTransactionPdf.as_view(), name='transaction_view_pdf'),
    path('accepted', AcceptedView.as_view(), name='accepted'),
    path('declined', DeclinedView.as_view(), name='declined'),
    path('action', ActionView.as_view(), name='action'),
    path('settings', SettingsView.as_view(), name='settings'),
    path('report/', ReportsView.as_view(), name='report_list'),
    path('report/upload', UploadReportView.as_view(), name='report_upload'),
    path('chargebacks', IncomingChargebacksView.as_view(), name='incoming_chargebacks'),
    path('chargebacks/decline/<detail_pk>', ChargebackDetailDeclineView.as_view(), name='incoming_chargeback_decline'),
    path('chargebacks/pend/<detail_pk>', ChargebackDetailPendView.as_view(), name='incoming_chargeback_pend'),
    path('chargebacks/accept/<detail_pk>', ChargebackDetailAcceptView.as_view(), name='incoming_chargeback_accept'),
    path('chargebacks/decline', DeclineChargeback.as_view(), name='decline_chargeback_action'),
    path('transactions-search/', TransactionsApiSearchView.as_view(), name='transactions_search'),
    path('financial-report/', FinancialReportView.as_view(), name='fin_report'),
    path(
        r'^profile$',
        PasswordChangeView.as_view(template_name='profile.html'),
        name='account_profile',
    ),
]
