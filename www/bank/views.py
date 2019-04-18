# django
from django.views.generic import TemplateView, ListView, DetailView, CreateView, View, UpdateView
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.http import HttpResponseRedirect, HttpResponse, HttpResponseServerError
from django.urls import reverse
from django.shortcuts import render
from django.template.loader import render_to_string, get_template
from io import BytesIO
from xhtml2pdf import pisa
from django.db.models import Q
import os


# my
from bank.models import Transaction, Report
from bank.forms import SettingsForm


class DashboardMixin(object):
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        return data


class DashboardBaseView(DashboardMixin, TemplateView):
    pass


class TransactionsView(DashboardMixin, ListView):
    template_name = "transactions.html"

    def get_queryset(self):
        return Transaction.objects.filter(Q(status='pended') | Q(status__isnull=True))

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


class ViewTransactionView(DashboardMixin, UpdateView):
    model = Transaction
    template_name = 'transaction_view.html'
    fields = ['comment', 'status']

    def get_success_url(self):
        html, path_pdf = data_for_pdf(self.object)
        if self.request.POST.get('status') == 'declined' and not os.path.exists(path_pdf):
            with open(path_pdf, 'w+b') as result:
                pdf = pisa.pisaDocument(BytesIO(html.encode('UTF-8')), result)
        return reverse('home')


class UploadReportView(DashboardMixin, CreateView):
    template_name = 'report_upload.html'
    fields = ('log', )
    model = Report
    success_url = '/'

    def get_initial(self):
        return {
            'status': 'new',
        }


class AcceptedView(DashboardMixin, ListView):
    template_name = "transactions.html"

    def get_queryset(self):
        return Transaction.objects.filter(status='accepted')

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        data.update({
            'filter': 'accepted',
        })
        return data


class DeclinedView(DashboardMixin, ListView):
    template_name = "transactions.html"

    def get_queryset(self):
        return Transaction.objects.filter(status='declined')

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        data.update({
            'filter': 'declined',
        })
        return data


class ActionView(DashboardMixin, View):
    def post(self, request):
        trans_ids = self.request.POST.getlist('ids[]')
        action = self.request.POST.get('action')
        assert action in ('accept', 'decline')

        query = Transaction.objects.filter(id__in=trans_ids)
        for transaction in query:
            if action == 'accept':
                transaction.status = 'accepted'
                transaction.save()
            elif action == 'decline':
                transaction.status = 'declined'
                transaction.save()
                if not os.path.exists(path_pdf):
                    html, path_pdf = data_for_pdf(transaction)
                    with open(path_pdf, 'w+b') as result:
                        pdf = pisa.pisaDocument(BytesIO(html.encode('UTF-8')), result)

        return HttpResponseRedirect(self.request.META.get('HTTP_REFERER'))


class SettingsView(DashboardMixin, UpdateView):
    form_class = SettingsForm
    template_name = 'settings.html'

    def get_success_url(self):
        return reverse('home')

    def get_object(self):
        return self.request.user.userprofile


class ViewTransactionPdf(DashboardMixin, DetailView):
    model = Transaction

    def render_to_response(self, request):
        html, path_pdf = data_for_pdf(self.object)
        result = BytesIO()
        pdf = pisa.pisaDocument(BytesIO(html.encode('UTF-8')), result)
        if pdf.err:
            return HttpResponseServerError()

        response = HttpResponse(result.getvalue(), content_type = 'application/pdf')
        response['Content-Disposition'] = 'inline; filename=' + path_pdf
        return response


def data_for_pdf(transaction):
    template = get_template('pdf.html')
    context = {'object': transaction}
    html = template.render(context)
    path_pdf = 'static/pdf/' + str(transaction.utrnno) + '.pdf'
    return html, path_pdf
