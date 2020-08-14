import datetime
import decimal
import logging
import re
import traceback

from django.utils import timezone
from django.utils.timezone import make_aware

from config import celery_app

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


@celery_app.task(ignore_result=True)
def process_report_task(report_id):
    from cop.core.models import Report, Transaction, Bank
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
            transaction.bank = Bank.objects.filter(bin__startswith=transaction.pan[0:6]).first()
            transaction.save()
            transactions.append(transaction)
        report.status = 'finished'
        report.save()
        assign_claim_transaction(report)
    except Exception as e:
        report.status = 'error'
        report.error = str(e) + '\n' + traceback.format_exc()
        report.save()
        raise


def parse_transaction(transaction_lines, previous_transaction=None):
    from .models import Transaction, Claim

    transaction = Transaction()
    transaction.raw = '\n'.join(transaction_lines)

    trans_time = None
    trans_date = None
    for line in transaction_lines:
        pan_match = re.search('[0-9]{6}[X*]{6}[0-9]{4}', line, re.M)
        if pan_match:
            transaction.pan = pan_match.group(0)

        approval_code_match = re.search('AUTH\. CODE: ([0-9]+)', line, re.M)
        if approval_code_match:
            transaction.approval_code = approval_code_match.group(1)

        trans_amount_match = re.search('AMOUNT ([0-9]+) ENTERED', line, re.M)
        if trans_amount_match:
            transaction.trans_amount = decimal.Decimal(trans_amount_match.group(1)) / decimal.Decimal('100.0')

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
                transaction.result = Claim.Result.FAILED
                break

    if trans_date and trans_time:
        trans_date = datetime.datetime.combine(trans_date, trans_time)
        transaction.trans_date = make_aware(trans_date, timezone=timezone.utc)
    elif trans_time and previous_transaction:
        trans_date = datetime.datetime.combine(previous_transaction.trans_date.date(), trans_time)
        transaction.trans_date = make_aware(trans_date, timezone=timezone.utc)

    if not transaction.result:
        if transaction.utrnno:
            transaction.result = Claim.Result.SUCCESSFUL
        else:
            transaction.result = Claim.Result.NEUTRAL

    return transaction


def assign_claim_transaction(report):
    """Set Claim transaction."""
    from cop.core.models import Transaction
    claim = report.claim_document.claim
    approval_code = claim.trans_approval_code
    qs = Transaction.objects.filter(pan__startswith=claim.pan[0:6], pan__endswith=claim.pan[-4:], report=report,
                                    trans_amount=claim.trans_amount, trans_date=claim.trans_date)
    if approval_code:
        qs.filter(approval_code=approval_code)
    transaction = qs.first()
    if transaction:
        claim.transaction = transaction
        claim.result = transaction.result
        claim.save()
