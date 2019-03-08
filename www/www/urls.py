# django
from django.conf.urls import url, include
from django.urls import path
from django.contrib import admin
from django.conf import settings
from django.contrib.auth.views import PasswordChangeView
from django.views.static import serve

# other
import debug_toolbar
from bank.views import TransactionsView, ReportsView, ViewTransactionView, UploadReportView, \
    AcceptedView, DeclinedView, ActionView, SettingsView


urlpatterns = [
    path('', TransactionsView.as_view(), name='home'),
    path('transaction/<pk>/view', ViewTransactionView.as_view(), name='transaction_view'),
    path('accepted', AcceptedView.as_view(), name='accepted'),
    path('declined', DeclinedView.as_view(), name='declined'),
    path('action', ActionView.as_view(), name='action'),
    path('settings', SettingsView.as_view(), name='settings'),
    url(r'^admin/', admin.site.urls),
    url(r'^accounts/', include('allauth.urls')),
    path('report/', ReportsView.as_view(), name='report_list'),
    path('report/upload', UploadReportView.as_view(), name='report_upload'),

    url(
        r'^profile$',
        PasswordChangeView.as_view(template_name='profile.html'),
        name='account_profile',
    ),
    url(r'^__debug__/', include(debug_toolbar.urls)),
]


if settings.DEBUG:
    urlpatterns += (
        url(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
    )
