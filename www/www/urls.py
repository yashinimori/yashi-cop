# django
from django.conf.urls import url, include
from django.urls import path
from django.contrib import admin
from django.conf import settings
from django.contrib.auth.views import PasswordChangeView
from django.views.static import serve

# other
import debug_toolbar
from bank.views import DashboardView, ReportsView


urlpatterns = [
    path('', DashboardView.as_view(), name='home'),
    url(r'^admin/', admin.site.urls),
    url(r'^accounts/', include('allauth.urls')),
    url(r'^reports/', ReportsView.as_view(), name='reports_view'),

    url(r'^accounts/profile/?$',
        PasswordChangeView.as_view(),
        {
            'template_name': 'profile.html',
        },
        name='account_profile'
    ),
    url(r'^__debug__/', include(debug_toolbar.urls)),
]


if settings.DEBUG:
    urlpatterns += (
        url(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
    )
