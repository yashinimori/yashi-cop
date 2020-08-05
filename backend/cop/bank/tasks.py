import datetime
import decimal
import logging
import re
import traceback

from django.utils import timezone
from django.utils.timezone import make_aware
from post_office import mail

from config.celery_app import app
from . import mastercom
from .mastercom import update_chargebacks
from .models import Claim, ATM

TRANSACTION_START = '-> TRANSACTION START'
TRANSACTION_END = '<- TRANSACTION END'
PAGE = '----------------------- Page'
MARK_FAILED = [
    'EXCEEDED DAILY LIMIT',
    'LIMIT EXCEEDED',
    'CAN NOT PROCESS',
    'INCORRECT PIN',
    'YOUR ISSUER IS NOT',
    'CANNOT PROCESS TRANSACTION',
    'INSUFFICIENT FUNDS',
    'TRANSACTION IS NOT',
    'CANNOT PROCESS AMOUNT',
    'COMMUNICATION ERROR'
]


@app.task(ignore_result=True)
def send_regular_emails_task():
    logging.debug('Send emails')
    mail.send_queued()


@app.task(ignore_result=True)
# @log('Process report')
def process_report_task(report_id):
    from .models import Report, Transaction

    try:
        report = Report.objects.get(id=report_id)
    except Report.DoesNotExist:
        logging.warning(f'Can not find report {report_id}')
        return

    if not report.log:
        return

    try:
        transactions_lines = []
        current_transaction = []
        lines = report.log.readlines()
        for line in lines:
            line = line.decode('utf8')
            if line.endswith('\r\n'):
                line = line[:-2]
            line = line.strip()

            # skip pages lines
            if re.search('^[0-9]+ / [0-9]+$', line):
                continue

            has_time = bool(re.search('^[0-9]{2}:[0-9]{2}:[0-9]{2}', line))

            if TRANSACTION_START in line:
                if len(current_transaction):
                    transactions_lines.append(current_transaction)
                    current_transaction = []

                current_transaction.append(line)
            elif TRANSACTION_END in line:
                current_transaction.append(line)
                transactions_lines.append(current_transaction)
                current_transaction = []
            elif PAGE in line:
                pass
            elif len(current_transaction):
                if has_time:
                    current_transaction.append(line)
                else:
                    current_transaction[-1] += ' ' + line

        if len(current_transaction):
            transactions_lines.append(current_transaction)

        transactions = []
        for transaction_lines in transactions_lines:
            previous_transaction = transactions[-1] if transactions else None
            transaction = parse_transaction(transaction_lines, previous_transaction)
            # seach for duplicates
            if transaction.utrnno:
                query = Transaction.objects.filter(report=report).filter(utrnno=transaction.utrnno)
                if len(query):
                    transactions.append(transaction)
                    continue
            elif transaction.trans_date:
                query = Transaction.objects.filter(report=report).filter(trans_date=transaction.trans_date)
                if len(query):
                    transactions.append(transaction)
                    continue
            else:
                logging.warning(f'Can not detect is transaction unique {transaction.raw}')
                continue

            transaction.report = report
            transaction.save()
            transactions.append(transaction)

        report.status = 'finished'
        report.save()
    except Exception as e:
        report.status = 'error'
        report.error = str(e) + '\n' + traceback.format_exc()
        report.save()
        raise


def parse_transaction(transaction_lines, previous_transaction=None):
    from .models import Transaction

    transaction = Transaction()
    transaction.raw = '\n'.join(transaction_lines)

    trans_time = None
    trans_date = None
    for line in transaction_lines:
        card_match = re.search('[0-9]{6}[X*]{6}[0-9]{4}', line, re.M)
        if card_match:
            transaction.card = card_match.group(0)

        auth_code_match = re.search('AUTH\. CODE: ([0-9]+)', line, re.M)
        if auth_code_match:
            transaction.auth_code = auth_code_match.group(1)

        atm_match = re.search('ATM: ([0-9a-zA-Z]+)', line, re.M)
        if atm_match:
            atm_uid = atm_match.group(1)
            atm, _ = ATM.objects.get_or_create(uid=atm_uid)
            transaction.atm = atm

        amount_match = re.search('AMOUNT ([0-9]+) ENTERED', line, re.M)
        if amount_match:
            transaction.trans_amount = decimal.Decimal(amount_match.group(1)) / decimal.Decimal('100.0')

        magazine_match = re.search('CASH WITHDRAWAL\s+[0-9.,]+\s+[a-zA-Z]+\s+([0-9]+)\s*-\s*([0-9]+)\s*-\s*([0-9]+)\s*-\s*([0-9]+)', line, re.M)
        if magazine_match and len(magazine_match.groups()) >= 4:
            try:
                parts = []
                for i in range(4):
                    parts.append(int(magazine_match.group(i + 1)))
                for i, value in enumerate(parts):
                    setattr(transaction, f'magazine{i + 1}_amount', value)
            except (ValueError, TypeError) as e:
                raise

        if 'UAH' in line:
            transaction.currency = 'UAH'
        elif 'USD' in line:
            transaction.currency = 'USD'

        available_match = re.search('AVAILABLE BALANCE  ([0-9]+\.[0-9]+)', line, re.M)
        if available_match:
            transaction.disp_amount = decimal.Decimal(available_match.group(1))

        if TRANSACTION_START in line:
            trans_time_match = re.search('([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2})', line, re.M)
            if trans_time_match:
                trans_time = datetime.time(hour=int(trans_time_match.group(1)),
                                           minute=int(trans_time_match.group(2)),
                                           second=int(trans_time_match.group(3)))

        date_match = re.search('([0-9]{1,2})/([0-9]{1,2})/([0-9]{1,2})', line)
        if date_match:
            trans_date = datetime.date(year=int(date_match.group(1)),
                                       month=int(date_match.group(2)),
                                       day=int(date_match.group(3)))

        utrnno_match = re.search('UTRNNO: ([0-9]+)', line)
        if utrnno_match:
            transaction.utrnno = utrnno_match.group(1)

        for error in MARK_FAILED:
            if error in line:
                transaction.result = 'failed'
                break

    if trans_date and trans_time:
        trans_date = datetime.datetime.combine(trans_date, trans_time)
        transaction.trans_date = make_aware(trans_date, timezone=timezone.utc)
    elif trans_time and previous_transaction:
        trans_date = datetime.datetime.combine(previous_transaction.trans_date.date(), trans_time)
        transaction.trans_date = make_aware(trans_date, timezone=timezone.utc)

    if not transaction.result:
        if transaction.utrnno:
            transaction.result = 'successful'
        else:
            transaction.result = 'neutral'

    return transaction


@app.task(ignore_result=True)
def load_claims_task():
    for queue in mastercom.list_queues():
        res_claims = mastercom.get_queue_claims(queue['queueName'])

        for res_claim in res_claims:
            data = {}
            for key, value in res_claim.items():
                new_key, _ = re.subn('([A-Z])', '_\\1', key)
                data[new_key.lower()] = value

            claim_id = data.pop('claim_id')
            Claim.objects.get_or_create(claim_id=claim_id, defaults=data)


@app.task(ignore_result=True)
# @log('Load chargebacks task')
def load_chargebacks_task():
    update_chargebacks()
