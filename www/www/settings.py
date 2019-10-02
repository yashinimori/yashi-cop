"""
Django settings for www project.
"""

import os

import environ

env = environ.Env(
    # set casting, default value
    DEBUG=(bool, False)
)
# reading .env file
environ.Env.read_env()

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SERVER = env('SERVER')
assert SERVER in ('prod', 'dev')

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.11/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = SERVER != 'prod'

if SERVER == 'prod':
    ALLOWED_HOSTS = [env('ALLOWED_HOSTS')]
else:
    ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',

    'bank',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'www.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'templates'),
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'www.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.11/ref/settings/#databases

DATABASES = {
    # read os.environ['DATABASE_URL'] and raises ImproperlyConfigured exception if not found
    'default': env.db(),
}


# Password validation
# https://docs.djangoproject.com/en/1.11/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/1.11/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.11/howto/static-files/

STATIC_URL = '/static/'

STATIC_ROOT = os.path.join(BASE_DIR, '..', 'volatile', 'static')

# Additional locations of static files
STATICFILES_DIRS = (
    # Put strings here, like "/home/html/static" or "C:/www/django/static".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
    os.path.join(BASE_DIR, 'static'),
)

MEDIA_ROOT = os.path.join(BASE_DIR, '..', 'persistent', 'media')
MEDIA_URL = '/media/'

SITE_ID = 1


########################################################################################################################
# Raven
########################################################################################################################
from raven.transport.requests import RequestsHTTPTransport

INSTALLED_APPS += (
    'raven.contrib.django.raven_compat',
)

RAVEN_CONFIG = {
    'dsn': 'https://6b336433ce9e443eaefbc22c020feb2d:8672c728b3f6447580b46291dde16b88@sentry.ferumflex.com/27',
    'transport': RequestsHTTPTransport,
}


########################################################################################################################
# EMAILS
########################################################################################################################
EMAIL_SUBJECT_PREFIX = '[Bank] '
SERVER_EMAIL = 'bank-noreply@ferumflex.com'
DEFAULT_FROM_EMAIL = SERVER_EMAIL


########################################################################################################################
# sparkpost
########################################################################################################################
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.sparkpostmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'SMTP_Injection'
EMAIL_HOST_PASSWORD = '68d94522429cc240af19e5d3968625fab81b7dcf'
EMAIL_USE_TLS = True


########################################################################################################################
# Post office
########################################################################################################################
INSTALLED_APPS += ('post_office', )
EMAIL_BACKEND = 'post_office.EmailBackend'

ADMINS = (
    ('FerumFlex', 'ferumflex@gmail.com'),
)


########################################################################################################################
# Admin logs
########################################################################################################################
INSTALLED_APPS += ('admin_logs', )
MIDDLEWARE = ['admin_logs.middleware.LogRequestMiddleware', ] + MIDDLEWARE

ADMIN_LOGS_BACKEND = 'admin_logs.backends.database.DatabaseBackend'


########################################################################################################################
# LOGGING
########################################################################################################################
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'root': {
        'level': 'INFO',
        'handlers': ['sentry', 'admin_logs', 'console', 'mail_admins'],
    },
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse',
        },
        'require_debug_true': {
            '()': 'django.utils.log.RequireDebugTrue',
        },
    },
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s '
                      '%(process)d %(thread)d %(message)s'
        },
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false', ],
            'class': 'django.utils.log.AdminEmailHandler'
        },
        'sentry': {
            'level': 'ERROR', # To capture more than ERROR, change to WARNING, INFO, etc.
            'class': 'raven.contrib.django.raven_compat.handlers.SentryHandler',
            'filters': ['require_debug_false', ],
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
            'filters': ['require_debug_true'],
        },
        'admin_logs': {
            'level': 'DEBUG',
            'class': 'admin_logs.log.AdminLogHandler',
        },
    }
}


########################################################################################################################
# Debug toolbar
########################################################################################################################
INSTALLED_APPS += ('debug_toolbar', )

MIDDLEWARE += [
    'debug_toolbar.middleware.DebugToolbarMiddleware',
]


def custom_show_toolbar(request):
    return hasattr(request, 'user') and request.user.is_superuser


DEBUG_TOOLBAR_CONFIG = {
    'INTERCEPT_REDIRECTS': False,
    'SHOW_TOOLBAR_CALLBACK': 'www.settings.custom_show_toolbar',
    'EXTRA_SIGNALS': [],
    'ENABLE_STACKTRACES': True,
}

DEBUG_TOOLBAR_PANELS = (
    'debug_toolbar.panels.versions.VersionsPanel',
    'debug_toolbar.panels.timer.TimerPanel',
    'debug_toolbar.panels.settings.SettingsPanel',
    'debug_toolbar.panels.headers.HeadersPanel',
    'debug_toolbar.panels.request.RequestPanel',
    'debug_toolbar.panels.sql.SQLPanel',
    'debug_toolbar.panels.staticfiles.StaticFilesPanel',
    'debug_toolbar.panels.templates.TemplatesPanel',
    'debug_toolbar.panels.cache.CachePanel',
    'debug_toolbar.panels.signals.SignalsPanel',
    'debug_toolbar.panels.logging.LoggingPanel',
    'debug_toolbar.panels.redirects.RedirectsPanel',
)

########################################################################################################################
# Django all auth
########################################################################################################################
AUTHENTICATION_BACKENDS = (
    # Needed to login by username in Django admin, regardless of `allauth`
    'django.contrib.auth.backends.ModelBackend',

    # `allauth` specific authentication methods, such as login by e-mail
    'allauth.account.auth_backends.AuthenticationBackend',
)

ACCOUNT_SESSION_REMEMBER = False
ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_EMAIL_REQUIRED = True

LOGIN_REDIRECT_URL = '/dashboard'

INSTALLED_APPS += (
    'allauth_bootstrap4',
    'crispy_forms',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    # 'allauth.socialaccount.providers.facebook',
)
CRISPY_TEMPLATE_PACK = 'bootstrap4'
########################################################################################################################
# Bootstrap
########################################################################################################################
INSTALLED_APPS += (
    'bootstrap3',
    'bootstrapform',
)


########################################################################################################################
# Django 
########################################################################################################################
REDIS_LOCATION = env('REDIS_LOCATION')

CELERY_DISABLE_RATE_LIMITS = True

CELERY_ACCEPT_CONTENT = ['pickle']
CELERY_TASK_SERIALIZER = 'pickle'
CELERY_RESULT_SERIALIZER = 'pickle'

CELERY_BROKER_URL = 'redis://%s/0' % REDIS_LOCATION

CELERY_RESULT_BACKEND = CELERY_BROKER_URL
CELERY_RESULT_PERSISTENT = False
CELERY_TASK_RESULT_EXPIRES = 18000  # 5 hours.
CELERY_TIMEZONE = 'Europe/Kiev'

# https://stackoverflow.com/questions/5336645/retry-lost-or-failed-tasks-celery-django-and-rabbitmq
CELERY_ACKS_LATE = True

# https://tech.labs.oliverwyman.com/blog/2015/04/30/making-celery-play-nice-with-rabbitmq-and-bigwig/
CELERY_BROKER_TRANSPORT_OPTIONS = {
    'confirm_publish': True,
}

from celery.schedules import crontab
CELERY_BEAT_SCHEDULE = {
    'send_emails': {
        'task': 'bank.tasks.send_regular_emails_task',
        'schedule': crontab(),
        'args': (),
    },
    'load_chargebacks': {
        'task': 'bank.tasks.load_chargebacks_task',
        'schedule': crontab(minute='*/30'),
        'args': (),
    }
}


########################################################################################################################
# Mastercom
########################################################################################################################
MASTERCOM_CONSUMER_KEY = env('MASTERCOM_CONSUMER_KEY')

MASTERCOM_KEY_ALIAS = env('MASTERCOM_KEY_ALIAS')
MASTERCOM_KEY_PASSWORD = env('MASTERCOM_KEY_PASSWORD')
MASTERCOM_KEY = os.path.join(BASE_DIR, 'keys', 'bankparser-sandbox.p12')
