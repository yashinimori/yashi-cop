# django
from django.views.generic import TemplateView, ListView, DetailView, CreateView, View, UpdateView
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.http import HttpResponseRedirect, HttpResponse, HttpResponseServerError
from django.urls import reverse
from django.conf import settings
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
        return Transaction.objects.filter(Q(status='pended') | Q(status__isnull=True)).select_related('atm')

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
    fields = ['comment', 'status', 'date_stamp_select']

    def get_success_url(self):
        if self.object.status == 'declined':
            save_transaction_pdf(self.object)
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
                save_transaction_pdf(transaction)

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
        html = render_transaction_for_pdf(self.object)
        result = BytesIO()
        pdf = pisa.pisaDocument(BytesIO(html.encode('UTF-8')), result)
        if pdf.err:
            return HttpResponseServerError()

        response = HttpResponse(result.getvalue(), content_type = 'application/pdf')
        response['Content-Disposition'] = f'inline; filename={self.object.utrnno}.pdf'
        return response


def render_transaction_for_pdf(transaction):
    template = get_template('pdf.html')
    html = template.render({'object': transaction})
    return html


def save_transaction_pdf(transaction):
    base_directory = os.path.join(settings.MEDIA_ROOT, 'pdf')
    if not os.path.exists(base_directory):
        os.mkdir(base_directory)
    path_pdf = os.path.join(base_directory, f'{transaction.utrnno}.pdf')

    if not os.path.exists(path_pdf):
        html = render_transaction_for_pdf(transaction)
        with open(path_pdf, 'w+b') as result:
            pdf = pisa.pisaDocument(BytesIO(html.encode('UTF-8')), result)
