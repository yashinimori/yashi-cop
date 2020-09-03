from djoser.email import ActivationEmail


class CustomActivationEmail(ActivationEmail):
    template_name = "email/custom_activation.html"

    def get_context_data(self):
        context = super().get_context_data()
        return context
