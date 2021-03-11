from django.contrib.auth.tokens import default_token_generator
from templated_mail.mail import BaseEmailMessage

from djoser import utils
from djoser.conf import settings

from config.settings.base import env

class CustomActivationEmail(BaseEmailMessage):
    template_name = "email/custom_activation.html"

    def get_context_data(self):
        # ActivationEmail can be deleted
        context = super().get_context_data()

        user = context.get("user")
        context["uid"] = utils.encode_uid(user.pk)
        context["token"] = default_token_generator.make_token(user)
        context["url"] = settings.ACTIVATION_URL.format(**context)
        context["domain"] = env.list("DJANGO_ALLOWED_HOSTS")[0]
        return context
