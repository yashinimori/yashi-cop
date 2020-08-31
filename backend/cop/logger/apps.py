from django.apps import AppConfig


class LoggerConfig(AppConfig):
    name = 'cop.logger'
    verbose_name = 'Logger'

    def ready(self):
        pass


