from django.contrib.auth import get_user_model
from django.contrib.postgres.fields import JSONField
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from rest_framework.exceptions import ValidationError

from cop.core.utils.sha256 import generate_sha256

User = get_user_model()

PRE_MEDIATION = 'pre_mediation'
MEDIATION = 'mediation'
CHARGEBACK = 'chargeback'
CHARGEBACK_ESCALATION = 'chargeback_escalation'
DISPUTE = 'dispute'
DISPUTE_RESPONSE = 'dispute_response'
PRE_ARBITRATION = 'pre_arbitration'
PRE_ARBITRATION_RESPONSE = 'pre_arbitration_response'
ARBITRATION = 'arbitration'
FINAL_RULING = 'final_ruling'

STAGE_CHOICES = (
    (PRE_MEDIATION, PRE_MEDIATION),
    (MEDIATION, MEDIATION),
    (CHARGEBACK, CHARGEBACK),
    (CHARGEBACK_ESCALATION, CHARGEBACK_ESCALATION),
    (DISPUTE, DISPUTE),
    (DISPUTE_RESPONSE, DISPUTE_RESPONSE),
    (PRE_ARBITRATION, PRE_ARBITRATION),
    (PRE_ARBITRATION_RESPONSE, PRE_ARBITRATION_RESPONSE),
    (ARBITRATION, ARBITRATION),
    (FINAL_RULING, FINAL_RULING),
)


class BaseModel(models.Model):
    create_date = models.DateTimeField(auto_now_add=True, db_index=True)
    update_date = models.DateTimeField(auto_now=True)

    class Meta(object):
        abstract = True


class Bank(BaseModel):
    TYPE = (
        ('ACQ', 'ACQ'),
        ('ISS', 'ISS'),
        ('BOTH', 'BOTH'),
    )

    bin = models.CharField(max_length=8, unique=True)
    type = models.CharField(choices=TYPE, max_length=4)
    name_eng = models.CharField(max_length=999)
    name_uk = models.CharField(max_length=999)
    name_rus = models.CharField(max_length=999)
    operator_name = models.CharField(max_length=999)
    contact_person = models.CharField(max_length=999)
    contact_telephone = models.CharField(max_length=999)
    contact_email = models.EmailField(max_length=999)

    def __str__(self):
        return self.name_eng


class BankEmployee(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bank = models.ForeignKey(Bank, on_delete=models.CASCADE, related_name="employee_banks")


class Merchant(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bank = models.ManyToManyField(Bank, blank=True)
    merch_id = models.CharField(max_length=15, unique=True)
    name_legal = models.CharField(max_length=999, blank=True, null=True)
    bin = models.CharField(max_length=999, blank=True, null=True)
    name_ips = models.CharField(max_length=999, blank=True, null=True)
    mcc = models.CharField(max_length=4, blank=True, null=True)
    description = models.CharField(max_length=999, blank=True, null=True)
    address = models.CharField(max_length=999, blank=True, null=True)
    terminal_id = models.CharField(max_length=8, blank=True, null=True)
    contact_person = models.CharField(max_length=999, blank=True, null=True)

    def __str__(self):
        return self.name_ips


class Terminal(BaseModel):
    term_id = models.CharField(max_length=999, unique=True)
    address = models.CharField(max_length=999, blank=True, null=True)
    merchant = models.ForeignKey(Merchant, on_delete=models.PROTECT)

    def __str__(self):
        return self.term_id


class Stage(BaseModel):
    stage = models.CharField(choices=STAGE_CHOICES, default=PRE_MEDIATION, max_length=999)
    name = models.CharField(max_length=999)


class Transaction(BaseModel):
    USD = 'usd'
    EUR = 'eur'
    HRN = 'hrn'
    CURRENCY_CHOICES = (
        (USD, 'дол. США'),
        (EUR, 'євро'),
        (HRN, 'грн')
    )
    RESULTS = (
        ('successful', 'Successful'),
        ('failed', 'Failed'),
        ('neutral', 'Neutral'),
    )
    bank = models.ForeignKey(Bank, on_delete=models.PROTECT, blank=True, null=True)
    terminal = models.ForeignKey(Terminal, on_delete=models.CASCADE, null=True, blank=True)
    merchant = models.ForeignKey(Merchant, on_delete=models.PROTECT, null=True, blank=True)
    pan = models.CharField(max_length=16)
    trans_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    currency = models.CharField(choices=CURRENCY_CHOICES, max_length=3, null=True, blank=True)
    approval_code = models.CharField(max_length=6, null=True, blank=True)
    cash_count = models.CharField(max_length=999, null=True, blank=True)
    error = models.CharField(max_length=999, null=True, blank=True)
    mcc = models.CharField(max_length=4, null=True, blank=True)

    trans_start = models.DateTimeField(max_length=12, null=True, blank=True)
    trans_end = models.DateTimeField(max_length=12, null=True, blank=True)
    trans_date = models.DateTimeField(max_length=12, null=True, blank=True)

    pin_entered = models.DateTimeField(max_length=12, null=True, blank=True)
    cash_request = models.DateTimeField(max_length=12, null=True, blank=True)
    cash_presented = models.DateTimeField(max_length=12, null=True, blank=True)
    cash_retracted = models.DateTimeField(max_length=12, null=True, blank=True)
    cash_taken = models.DateTimeField(max_length=12, null=True, blank=True)
    card_taken = models.DateTimeField(max_length=12, null=True, blank=True)

    disp_amount = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True)
    result = models.CharField(max_length=999, db_index=True, null=True, blank=True)
    utrnno = models.CharField(max_length=100, null=True, blank=True, db_index=True)
    raw = models.TextField(null=True)
    report = models.ForeignKey('Report', on_delete=models.SET_NULL, null=True)
    scoring = models.IntegerField(null=True, default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    magazine1_amount = models.IntegerField(default=0)
    magazine2_amount = models.IntegerField(default=0)
    magazine3_amount = models.IntegerField(default=0)
    magazine4_amount = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.trans_date}, {self.currency}, {self.disp_amount}, {self.result} "

    def save(self, *args, **kwargs):
        if self.result == 'successful':
            self.scoring = 100
        return super().save(*args, **kwargs)


class Comment(BaseModel):
    text = models.TextField()
    user = models.ForeignKey(User, on_delete=models.PROTECT)

    def __str__(self):
        return self.text


class ReasonCodeGroup(BaseModel):
    code = models.CharField(max_length=4)
    visa = models.CharField(max_length=128, blank=True, null=True)
    mastercard = models.CharField(max_length=128, blank=True, null=True)
    description = models.CharField(max_length=999, blank=True, null=True)

    def __str__(self):
        return self.code


class Claim(BaseModel):
    class Result:
        SUCCESSFUL = 'successful'
        FAILED = 'failed'
        NEUTRAL = 'neutral'
        CHOICES = (
            (SUCCESSFUL, 'Successful'),
            (FAILED, 'Failed'),
            (NEUTRAL, 'Neutral'),
        )
    SUPPORT_CHOICES = (
        ('one_them_chargeback', 'One them chargebacks'),
        ('on_us_chargeback', 'On us chargeback'),
        ('us_on_us', 'Us on us'),
        ('fraud', 'Fraud'),
    )

    user = models.ForeignKey(User, related_name='claim_users', on_delete=models.CASCADE, blank=True, null=True)
    mediator = models.ForeignKey(User, related_name='claim_mediators', on_delete=models.CASCADE, blank=True, null=True)

    issuer_mmt = models.CharField(max_length=40, null=True, blank=True)
    dispute_mmt = models.CharField(max_length=40, null=True, blank=True)
    ch_mmt = models.CharField(max_length=999, null=True, blank=True)
    merchant_mmt = models.CharField(max_length=999, null=True, blank=True)

    source = models.CharField(max_length=999, null=True, blank=True)
    arn = models.CharField(max_length=23, null=True, blank=True)
    flag = models.CharField(max_length=999, null=True, blank=True)

    # merchant
    merch_id = models.CharField(max_length=15, null=True, blank=True)
    merch_name_ips = models.CharField(max_length=99, null=True, blank=True)
    merchant = models.ForeignKey(
        Merchant,
        on_delete=models.PROTECT,
        blank=True,
        null=True,
        related_name='merchants',
    )
    bank = models.ForeignKey(
        Bank,
        on_delete=models.PROTECT,
        blank=True,
        null=True,
        related_name='banks',
    )

    # terminal
    term_id = models.CharField(max_length=8, null=True, blank=True)
    terminal = models.ForeignKey(Terminal, on_delete=models.CASCADE, blank=True, null=True, related_name='terminals')

    # transaction
    trans_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    trans_currency = models.CharField(choices=Transaction.CURRENCY_CHOICES, max_length=3)
    trans_approval_code = models.CharField(max_length=6)
    trans_date = models.DateTimeField(max_length=12)
    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE, blank=True, null=True,
                                    related_name='transactions')
    pan = models.CharField(max_length=16, null=True, blank=True)

    claim_reason_code = models.ForeignKey(ReasonCodeGroup, on_delete=models.CASCADE)
    reason_code_group = models.CharField(max_length=999, blank=True, null=True, help_text='Code description')
    reason_code = models.CharField(max_length=4, blank=True, null=True, help_text='IPS code')

    action_needed = models.CharField(max_length=999, null=True, blank=True)
    ch_comments = models.ManyToManyField(Comment, blank=True, related_name='ch_comments')
    bank_comments_i = models.ManyToManyField(Comment, blank=True, related_name='bank_comments_i')
    bank_comments_a = models.ManyToManyField(Comment, blank=True, related_name='bank_comments_a')
    merchant_comments = models.ManyToManyField(Comment, blank=True, related_name='merch_comments')

    stage = models.CharField(choices=STAGE_CHOICES, default=PRE_MEDIATION, max_length=999)
    result = models.CharField(choices=Result.CHOICES, max_length=999, blank=True, null=True)
    support = models.CharField(choices=SUPPORT_CHOICES, max_length=999, blank=True, null=True)

    answers = JSONField(max_length=999, blank=True, null=True)

    due_date = models.DateTimeField(null=True, blank=True)
    dispute_date = models.DateTimeField(null=True, blank=True)
    registration_date = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    final_date = models.DateTimeField(null=True, blank=True)
    chargeback_date = models.DateTimeField(null=True, blank=True)
    second_presentment_date = models.DateTimeField(null=True, blank=True)
    pre_arbitration_date = models.DateTimeField(null=True, blank=True)
    pre_arbitration_response_date = models.DateTimeField(null=True, blank=True)
    arbitration_date = models.DateTimeField(null=True, blank=True)
    arbitration_response_date = models.DateTimeField(null=True, blank=True)


class ClaimDocument(BaseModel):
    """Upload Documents for specific Claim."""
    class Types:
        SUBSTITUTE_DRAFT = 'substitute_draft'
        CHECK = 'check'
        COMPELLING_EVIDENCE = 'compelling_evidence'
        NOT_NEEDED = 'docs_not_needed'

        choices = (
            (SUBSTITUTE_DRAFT, 'Substitute Draft'),
            (CHECK, 'Check'),
            (COMPELLING_EVIDENCE, 'Compelling evidence'),
            (NOT_NEEDED, 'Docs not needed'),
        )
    type = models.CharField(choices=Types.choices, max_length=20)
    description = models.CharField(max_length=255, null=True, blank=True)
    file = models.FileField(upload_to='claim-documents/')
    claim = models.ForeignKey(Claim, on_delete=models.CASCADE, related_name='documents')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def delete_task(self):
        """TODO: CELERY task check if 90 days passed since claim archivation.
        Send notification to chb_officer so he can download the file.
        Delete document after 90 + 7 days since claim archivation"""


class SurveyQuestion(BaseModel):
    description = models.CharField(max_length=999)

    def __str__(self):
        return self.description


class Report(BaseModel):
    """Log parsing report for internal use."""
    STATUSES = (
        ('new', 'New'),
        ('error', 'Error'),
        ('finished', 'Finished'),
    )
    claim_document = models.ForeignKey(ClaimDocument, on_delete=models.CASCADE)
    log = models.FileField(upload_to='logs/%Y/%m/%d/')
    status = models.CharField(choices=STATUSES, max_length=100, db_index=True, default=STATUSES[0][0])
    error = models.TextField(null=True, blank=True)
    log_hash = models.CharField(unique=True, max_length=256, db_index=True, null=True, blank=True)

    def __str__(self):
        return f'Report: {self.status}'

    def clean(self):
        log_hash = generate_sha256(self.log.file)
        query = Report.objects.filter(log_hash=log_hash)
        if self.pk:
            query = query.exclude(pk=self.pk)
        count = len(query)
        if count:
            raise ValidationError('This file already exists')

        self.log_hash = log_hash
