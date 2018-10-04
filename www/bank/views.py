# django
from django.views.generic import TemplateView, ListView
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator

# my
from bank.models import Transaction, Report


class DashboardMixin(object):
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        return data


class DashboardBaseView(DashboardMixin, TemplateView):
    pass


class DashboardView(DashboardMixin, ListView):
    template_name = "dashboard.html"

    def get_queryset(self):
        return Transaction.objects.all()

    def get_context_data(self):
        context = super().get_context_data()

        context.update({
            'successful_count': len(Transaction.objects.filter(result='successful')),
            'failed_count': len(Transaction.objects.filter(result='failed')),
            'neutral_count': len(Transaction.objects.filter(result='neutral')),
            'total_count': len(Transaction.objects.all()),
        })

        return context


class ReportsView(DashboardMixin, ListView):
    template_name = "reports.html"

    def get_queryset(self):
        return Report.objects.all()
