from django.apps import AppConfig


class CoreConfig(AppConfig):
    name = 'cop.core'
    verbose_name = 'Core'

    def ready(self):
        import cop.core.signals  # noqa
