# django
import os
from datetime import datetime
from io import BytesIO

from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.db.models import Q, Count, Sum
from django.http import HttpResponseRedirect, HttpResponse, HttpResponseServerError
from django.shortcuts import redirect
from django.template.loader import get_template
from django.urls import reverse
from django.utils.decorators import method_decorator
from django.views.generic import TemplateView, ListView, DetailView, CreateView, View, UpdateView, FormView
from django.views.generic.edit import FormMixin
from xhtml2pdf import pisa

from bank.forms import SettingsForm, TransactionApiSearchForm, FinancialReportSearchForm
# my
from bank.mastercom import search_for_transactions, get_clearing_details, get_authorization_details, create_chargeback
from cop.bank.models import Transaction, Report, Chargeback, ChargebackDetail


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
    template_name = "pages/transactions.html"

    def get_queryset(self):
        return Transaction.objects.filter(Q(status='pended') | Q(status__isnull=True)).select_related('atm')

    def get_context_data(self):
        context = super().get_context_data()
        qs = Transaction.objects.aggregate(
            num_successful=Count('pk', filter=Q(result='successful')),
            num_failed=Count('pk', filter=Q(result='failed')),
            num_neutral=Count('pk', filter=Q(result='neutral')),
            total=Count('pk')
        )

        context.update({
            'successful_count': qs['num_successful'],
            'failed_count': qs['num_failed'],
            'neutral_count': qs['num_neutral'],
            'total_count': qs['total'],
        })

        return context


class ReportsView(DashboardMixin, ListView):
    template_name = "pages/reports.html"

    def get_queryset(self):
        return Report.objects.all()


class ViewTransactionView(DashboardMixin, UpdateView):
    model = Transaction
    template_name = 'pages/transaction_view.html'
    fields = ['comment', 'status', 'date_stamp_select']

    def get_success_url(self):
        if self.object.status == 'declined':
            save_transaction_pdf(self.object)
        return reverse('home')


class UploadReportView(DashboardMixin, CreateView):
    template_name = 'pages/report_upload.html'
    fields = ('log',)
    model = Report
    success_url = '/'

    def get_initial(self):
        return {
            'status': 'new',
        }


class AcceptedView(DashboardMixin, ListView):
    template_name = "pages/accepted_declined_transactions.html"

    def get_queryset(self):
        return Chargeback.objects.filter(chargeback_detail__result='Accepted'). \
            prefetch_related('chargeback_detail').select_related('atm_transaction').distinct()

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        data.update({
            'filter': 'Accepted',
        })
        return data


class DeclinedView(DashboardMixin, ListView):
    template_name = "pages/accepted_declined_transactions.html"

    def get_queryset(self):
        return Chargeback.objects.filter(chargeback_detail__result='Declined'). \
            prefetch_related('chargeback_detail').select_related('atm_transaction').distinct()

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        data.update({
            'filter': 'Declined',
        })
        return data


class ActionView(DashboardMixin, View):
    def post(self, request):
        chargback_ids = self.request.POST.getlist('ids[]')
        action = self.request.POST.get('action')
        assert action in ('Accepted', 'Declined')

        chargbacks = Chargeback.objects.filter(id__in=chargback_ids).prefetch_related('chargeback_detail')
        for chargback in chargbacks:
            chargback.chargeback_detail.filter(Q(result__isnull=True) | Q(result='Pend')). \
                update(result=action, result_date=datetime.now())

        return HttpResponseRedirect(self.request.META.get('HTTP_REFERER'))


class SettingsView(DashboardMixin, UpdateView):
    form_class = SettingsForm
    template_name = 'pages/settings.html'

    def get_success_url(self):
        return reverse('home')

    def get_object(self):
        return self.request.user


class ViewTransactionPdf(DashboardMixin, DetailView):
    model = Transaction

    def render_to_response(self, request):
        html = render_transaction_for_pdf(self.object)
        result = BytesIO()
        pdf = pisa.pisaDocument(BytesIO(html.encode('UTF-8')), result)
        if pdf.err:
            return HttpResponseServerError()

        response = HttpResponse(result.getvalue(), content_type='application/pdf')
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
    return path_pdf


class IncomingChargebacksView(DashboardMixin, ListView):
    template_name = "pages/chargebacks.html"
    queryset = Chargeback.objects.prefetch_related('chargeback_detail').select_related('atm_transaction')


class ChargebackDetailDeclineView(DashboardMixin, DetailView):
    queryset = ChargebackDetail.objects.select_related('chargeback')
    template_name = "pages/chargeback_decline.html"
    pk_url_kwarg = "detail_pk"


class ChargebackDetailPendView(DashboardMixin, DetailView):
    model = ChargebackDetail
    template_name = "pages/chargeback_decline.html"
    pk_url_kwarg = "detail_pk"

    def get_object(self, queryset=None):
        """Update ChargebackDetail result and resuld_date."""
        obj = super().get_object(queryset)
        obj.result = 'Pend'
        obj.result_date = datetime.now()
        obj.save()
        return obj

    def get(self, request, *args, **kwargs):
        super().get(request, *args, **kwargs)
        return redirect(reverse('incoming_chargebacks'))


class ChargebackDetailAcceptView(DashboardMixin, DetailView):
    model = ChargebackDetail
    template_name = "pages/chargeback_decline.html"
    pk_url_kwarg = "detail_pk"

    def get_object(self, queryset=None):
        """Update ChargebackDetail result and resuld_date."""
        obj = super().get_object(queryset)
        obj.result = 'Accepted'
        obj.result_date = datetime.now()
        obj.save()
        return obj

    def get(self, request, *args, **kwargs):
        super().get(request, *args, **kwargs)
        return redirect(reverse('incoming_chargebacks'))


class DeclineChargeback(DashboardMixin, View):
    def post(self, request):
        data = request.POST
        transaction = Transaction.objects.get(id=data['transaction_id'])
        pdf_path = save_transaction_pdf(transaction)
        response = create_chargeback(
            claim_id=data['claim_id'],
            currency=data['currency'],
            amount=data['amount'],
            reason_code=data['reason_code'],
            chargeback_type=data['chargeback_type'],
            filename='secpres.pdf',
            file_path=pdf_path,
            message_text=data['mmt']
        )
        if response.get('chargebackId'):
            obj = ChargebackDetail.objects.get(id=data['chargback_detail_id'])
            obj.result = 'Declined'
            obj.result_date = datetime.now()
            obj.save()

        return redirect(reverse('incoming_chargebacks'))


class TransactionsApiSearchView(DashboardMixin, FormView):
    template_name = "pages/transactions_api_search.html"
    form_class = TransactionApiSearchForm

    def get_context_data(self, transactions=(), **kwargs):
        context = super().get_context_data(**kwargs)
        context['object_list'] = transactions
        return context

    @staticmethod
    def add_claim_id(transactions):
        transaction_ids = [transaction['transaction_id'] for transaction in transactions]
        chargebacks = Chargeback.objects.filter(transaction_id__in=transaction_ids).prefetch_related(
            'chargeback_detail')
        for transaction in transactions:
            for chargeback in chargebacks:
                if transaction['transaction_id'] == chargeback.transaction_id:
                    transaction['claim_id'] = chargeback.claim_id
                    transaction['is_chargeback_details'] = bool(chargeback.chargeback_detail.all().count())
        return transactions

    @staticmethod
    def clean_transactions(transactions):
        data = []
        for transaction in transactions:
            data.append({
                'transaction_id': transaction.get('transactionId'),
                'pan': transaction.get('primaryAccountNumber'),
                'auth_date_and_time': transaction.get('authorizationDateAndTime'),
                'amount_local': transaction.get('clearingSummary')[0].get('transactionAmountLocal'),
                'currency_code': transaction.get('currencyCode'),
            })
        return data

    @staticmethod
    def add_clearing_details(transactions):
        for transaction in transactions:
            if transaction.get('claim_id'):
                response = get_clearing_details(transaction['claim_id'], transaction['transaction_id'])
                transaction['ecsli'] = response.get('electronicCommerceSecurityLevelIndicator')
                transaction['mmsan'] = response.get('mastercardMappingServiceAccountNumber')
                transaction['cam'] = response.get('CardholderAuthenticationMethod')
        return transactions

    @staticmethod
    def add_authorization_details(transactions):
        for transaction in transactions:
            if transaction.get('claim_id'):
                response = get_authorization_details(transaction['claim_id'], transaction['transaction_id'])
                transaction['mcc_message_id'] = response.get('mccMessageId')
                transaction['card_acceptor_terminal_id'] = response.get('cardAcceptorTerminalId')
                transaction['card_acceptor_name'] = response.get('cardAcceptorName')
                transaction['catl'] = response.get('cardholderActivatedTerminalLevel')
        return transactions

    def form_valid(self, form):
        data = form.cleaned_data
        transactions = search_for_transactions(data['pan'], data['arn'], data['start_date'], data['end_date'])
        cleaned_transactions = self.clean_transactions(transactions)
        transactions_claim_ids = self.add_claim_id(cleaned_transactions)
        transactions_clearing = self.add_clearing_details(transactions_claim_ids)
        transactions_authorization = self.add_authorization_details(transactions_clearing)

        context = self.get_context_data(transactions=transactions_authorization)
        return self.render_to_response(context=context)

    def get_success_url(self):
        return self.request.META.get('HTTP_REFERER')


class FinancialReportView(DashboardMixin, ListView, FormMixin):
    template_name = "pages/financial_report.html"
    form_class = FinancialReportSearchForm

    def get_queryset(self):
        form = self.get_form()
        result = []
        if form.is_valid():
            form_data = form.cleaned_data
            terminal_id = form_data.get('terminal_id')
            search_kwargs = {
                'trans_date__month': form_data['date'].month,
                'trans_date__day': form_data['date'].day,
            }
            if terminal_id:
                search_kwargs.update({
                    'atm__uid': terminal_id
                })

            qs = Transaction.objects.select_related('atm')
            qs_filtered = qs.filter(**search_kwargs)
            bins = []
            for item in qs_filtered:
                if not item.card or item.card and item.card[0:6] in bins:
                    continue
                bins.append(item.card[0:6])
                item.quantity = qs.filter(card__startswith=item.card[0:6]).count()
                item.amount = qs.filter(atm__uid=item.atm.uid, card__startswith=item.card[0:6]).\
                    aggregate(Sum('trans_amount')).get('trans_amount__sum')
                item.interchange_rate_percent = 1.1
                if item.amount:
                    percent = item.interchange_rate_percent / 100
                    item.interchange_total = percent * float(item.amount)
                    item.interchange_total = round(item.interchange_total, 2)
                result.append(item)

            qs_filtered.values('card').annotate(amount=Sum('trans_amount'))

        return result

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form'] = self.get_form()
        return context

    def form_valid(self, form):
        context = self.get_context_data()
        return self.render_to_response(context)

    def post(self, request, *args, **kwargs):
        """
        Handle POST requests: instantiate a form instance with the passed
        POST variables and then check if it's valid.
        """
        return self.get(request, *args, **kwargs)
