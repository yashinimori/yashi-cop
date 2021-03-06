from cryptography.fernet import Fernet
from django.conf import settings
from django.contrib.postgres.fields import JSONField, ArrayField
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from rest_framework.exceptions import ValidationError

from cop.core.utils.save_transaction_pdf import save_transaction_pdf
from cop.core.utils.sha256 import generate_sha256
from cop.users.models import Merchant
from cop.utils.storages import LogsRootS3Boto3Storage

User = settings.AUTH_USER_MODEL


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


class BankBin(BaseModel):
    bank = models.ForeignKey(Bank, on_delete=models.CASCADE, related_name="bins")
    bin = models.CharField(max_length=8, unique=True, primary_key=True)
    product_code = models.CharField(max_length=999, blank=True, null=True)


class ATM(BaseModel):
    bank = models.ForeignKey(Bank, on_delete=models.CASCADE)
    merch_id = models.CharField(max_length=15, unique=True)
    name_legal = models.CharField(max_length=999, blank=True, null=True)
    bin = models.CharField(max_length=999, blank=True, null=True)
    name_ips = models.CharField(max_length=999)
    mcc = models.CharField(max_length=4, blank=True, null=True)
    description = models.CharField(max_length=999, blank=True, null=True)
    address = models.CharField(max_length=999, blank=True, null=True)
    contact_person = models.CharField(max_length=999, blank=True, null=True)

    def __str__(self):
        return self.name_ips


class Terminal(BaseModel):
    term_id = models.CharField(max_length=999, unique=True)
    address = models.CharField(max_length=999, blank=True, null=True)
    merchant = models.ForeignKey(Merchant, on_delete=models.PROTECT, related_name='terminals')

    def __str__(self):
        return self.term_id


class Transaction(BaseModel):
    USD = 'usd'
    EUR = 'eur'
    UAH = 'uah'
    CURRENCY_CHOICES = (
        (USD, '??????. ??????'),
        (EUR, '????????'),
        (UAH, '??????')
    )

    class Results:
        SUCCESSFUL = 'successful'
        FAILED = 'failed'
        NEUTRAL = 'neutral'
        CHOICES = (
            (SUCCESSFUL, 'Successful'),
            (FAILED, 'Failed'),
            (NEUTRAL, 'Neutral'),
        )
        STATUSES = (
            ('accepted', 'Accepted'),
            ('declined', 'Declined'),
            ('pended', 'Pended'),
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
    result = models.CharField(choices=Results.CHOICES, max_length=999, db_index=True, null=True, blank=True)
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


class ReasonCodeGroup(BaseModel):
    ATM_CLAIM_CODE = '0001'

    class Group:
        FRAUD = 'fraud'
        AUTHORIZATION = 'authorization'
        POINT_OF_INTERACTION_ERROR = 'point_of_interaction_error'
        CARDHOLDER_DISPUTES = 'cardholder_disputes'
        CHOICES = (
            (FRAUD, 'Fraud'),
            (AUTHORIZATION, 'Authorization'),
            (POINT_OF_INTERACTION_ERROR, 'Point-of-Interaction Error'),
            (CARDHOLDER_DISPUTES, 'Cardholder Disputes'),
        )

    group_visa = models.CharField(max_length=128, choices=Group.CHOICES, null=True, blank=True)
    group_mastercard = models.CharField(max_length=128, choices=Group.CHOICES, null=True, blank=True)
    code = models.CharField(max_length=4)
    visa = models.CharField(max_length=128, blank=True, null=True)
    mastercard = models.CharField(max_length=128, blank=True, null=True)
    description = models.CharField(max_length=999, blank=True, null=True)

    def __str__(self):
        return self.code


class Claim(BaseModel):
    class FormNames:
        ESCALATE = 'escalate_form'
        CLOSE_FORM = 'close_form'
        CLARIFY_FORM = 'clarify_form'
        QUERY_FORM = 'query_form'
        SURVEY_FORM = 'survey_form'
        CHOICES = (
            (ESCALATE, ESCALATE),
            (CLOSE_FORM, CLOSE_FORM),
            (CLARIFY_FORM, CLARIFY_FORM),
            (QUERY_FORM, QUERY_FORM),
            (SURVEY_FORM, SURVEY_FORM)
        )

    class Result:
        SUCCESSFUL = 'successful'
        FAILED = 'failed'
        NEUTRAL = 'neutral'
        CHOICES = (
            (SUCCESSFUL, 'Successful'),
            (FAILED, 'Failed'),
            (NEUTRAL, 'Neutral'),
        )

    class Support:
        US_ON_THEM = 'us_on_them'
        THEM_ON_US = 'them_on_us'
        US_ON_US = 'us_on_us'
        CHOICES = (
            (US_ON_THEM, 'Us on them'),
            (THEM_ON_US, 'Them on us'),
            (US_ON_US, 'Us on us'),
        )

    ACCEPTED_REFUND = 1
    PARTLY_REFUND = 2
    DECLINED_REFUND_DOCS = 3
    DECLINED_REFUND_COMMENTS = 4
    OFFICER_ANSWER_REASON_CHOICES = (
        (ACCEPTED_REFUND, "???????????????????? ??????????????????, ???????????????? ??????????????????????"),
        (PARTLY_REFUND, "???????????????? ??????????????????, ???????????????? ??????????????????????"),
        (DECLINED_REFUND_DOCS, "?? ???????????????????? ????????????????????, ?????????????????? ??????????????????"),
        (DECLINED_REFUND_COMMENTS, "?? ???????????????????? ????????????????????, ?????????????????? ??????????????????"),
    )

    class Flags:
        YELLOW = 'yellow'
        RED = 'red'
        CHOICES = (
            (YELLOW, 'Yellow'),
            (RED, 'Red'),
        )

    form_name = models.CharField(choices=FormNames.CHOICES, max_length=32, null=True, blank=True)
    officer_answer_reason = models.CharField(choices=OFFICER_ANSWER_REASON_CHOICES, max_length=2, null=True, blank=True)
    user = models.ForeignKey(User, related_name='claim_users', on_delete=models.SET_NULL, blank=True, null=True)
    mediator = models.ForeignKey(User, related_name='claim_mediators', on_delete=models.CASCADE, blank=True, null=True)
    replier = models.ForeignKey(User, related_name='claim_repliers', on_delete=models.SET_NULL, blank=True, null=True)
    chargeback_officer = models.ForeignKey(User, related_name='claim_chargeback_officers', on_delete=models.SET_NULL,
                                           blank=True, null=True)

    issuer_mmt = models.CharField(max_length=40, null=True, blank=True)
    acquirer_mmt = models.CharField(max_length=40, null=True, blank=True)
    dispute_mmt = models.CharField(max_length=40, null=True, blank=True)
    ch_mmt = models.CharField(max_length=999, null=True, blank=True)
    merchant_mmt = models.CharField(max_length=999, null=True, blank=True)

    source = models.CharField(max_length=999, null=True, blank=True)
    arn = models.CharField(max_length=23, null=True, blank=True)
    flag = models.CharField(choices=Flags.CHOICES, max_length=12, null=True, blank=True)
    atm = models.ForeignKey('ATM', on_delete=models.SET_NULL, null=True, blank=True)

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
    trans_approval_code = models.CharField(max_length=6, blank=True, null=True)
    trans_date = models.DateTimeField(max_length=12)
    transaction = models.ForeignKey(Transaction, on_delete=models.SET_NULL, blank=True, null=True,
                                    related_name='transactions')
    pan = models.CharField(max_length=256)
    hidden_pan = models.CharField(max_length=16)

    claim_reason_code = models.ForeignKey(ReasonCodeGroup, on_delete=models.CASCADE)
    reason_code_group = models.CharField(max_length=999, blank=True, null=True, help_text='Code description')
    reason_code = models.CharField(max_length=4, blank=True, null=True, help_text='IPS code')

    action_needed = models.BooleanField(default=False)

    status = models.ForeignKey('Status', on_delete=models.PROTECT)
    result = models.CharField(max_length=999, blank=True, null=True)
    support = models.CharField(choices=Support.CHOICES, max_length=999, blank=True, null=True)

    answers = JSONField(max_length=999, blank=True, null=True)

    reminder_task_ids = ArrayField(ArrayField(models.CharField(max_length=32)), blank=True, null=True)
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

    archived = models.BooleanField(default=False)

    @property
    def clarify_form_received(self):
        return self.form_name == self.FormNames.CLARIFY_FORM

    @property
    def escalation_form_received(self):
        return self.form_name == self.FormNames.ESCALATE

    @property
    def close_form_received(self):
        return self.form_name == self.FormNames.CLOSE_FORM

    @property
    def query_form_received(self):
        return self.form_name == self.FormNames.QUERY_FORM

    @property
    def survey_form_received(self):
        return self.form_name == self.FormNames.SURVEY_FORM

    @property
    def officer_answer_refund(self):
        return self.officer_answer_reason == self.ACCEPTED_REFUND or self.officer_answer_reason == self.PARTLY_REFUND

    @property
    def decoded_pan(self):
        f = Fernet(settings.ENCRYPT_KEY)
        return f.decrypt(self.pan.encode('utf-8')).decode('utf-8')

    @staticmethod
    def encrypt_pan(value):
        f = Fernet(settings.ENCRYPT_KEY)
        value_bytes = str.encode(value)
        return f.encrypt(value_bytes).decode()

    def assign_transaction(self):
        approval_code = self.trans_approval_code
        qs = Transaction.objects.filter(pan__startswith=self.hidden_pan[0:6], pan__endswith=self.hidden_pan[-4:],
                                        trans_amount=self.trans_amount, trans_date__date=self.trans_date)
        if approval_code:
            qs.filter(approval_code=approval_code)
        transaction = qs.first()
        if transaction:
            self.transaction = transaction
            self.result = transaction.result
            self.save()
            if self.result == Transaction.Results.SUCCESSFUL:
                self.add_transaction_data()

    def add_transaction_data(self):
        from django.contrib.auth import get_user_model

        media_path = save_transaction_pdf(self.transaction)
        system_user = get_user_model().objects.get(email='system@cop.cop')
        ClaimDocument.objects.create(
            type=ClaimDocument.Types.ATM_LOG,
            file=media_path,
            claim=self,
            user=system_user
        )
        Comment.objects.create(
            text='???????????? ?????????????????????? ?????????????? ???????????????? ???????? ?????????????????? ??????????????, ?????????? ???????? ????????????????',
            user=system_user,
            claim=self
        )


class ClaimDocument(BaseModel):
    """Upload Documents for specific Claim."""

    class Types:
        SUBSTITUTE_DRAFT = 'substitute_draft'
        CHECK = 'check'
        COMPELLING_EVIDENCE = 'compelling_evidence'
        ATM_LOG = 'atm_log'
        NOT_NEEDED = 'docs_not_needed'

        choices = (
            (SUBSTITUTE_DRAFT, 'Substitute Draft'),
            (CHECK, 'Check'),
            (COMPELLING_EVIDENCE, 'Compelling evidence'),
            (ATM_LOG, 'ATM log'),
            (NOT_NEEDED, 'Docs not needed'),
        )
    type = models.CharField(choices=Types.choices, max_length=20, null=True, blank=True)
    description = models.CharField(max_length=255, null=True, blank=True)
    file = models.FileField(upload_to='claim-documents/')
    claim = models.ForeignKey(Claim, on_delete=models.CASCADE, related_name='documents')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def delete_task(self):
        """TODO: CELERY task check if 90 days passed since claim archivation.
        Send notification to chb_officer so he can download the file.
        Delete document after 90 + 7 days since claim archivation"""


class Comment(BaseModel):
    text = models.TextField()
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    claim = models.ForeignKey(Claim, on_delete=models.CASCADE, related_name='comments')

    def __str__(self):
        return self.text


class Status(BaseModel):
    class Stages:
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
        CLOSED = 'closed'

        CHOICES = (
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
            (CLOSED, CLOSED),
        )
    index = models.PositiveIntegerField(unique=True)
    name = models.CharField(max_length=999)
    stage = models.CharField(choices=Stages.CHOICES, default=Stages.PRE_MEDIATION, max_length=999)

    def __str__(self):
        return self.name

    @property
    def is_pre_mediation(self):
        return self.stage == self.Stages.PRE_MEDIATION

    @property
    def is_mediation(self):
        return self.stage == self.Stages.MEDIATION

    @property
    def is_chargeback(self):
        return self.stage == self.Stages.CHARGEBACK

    @property
    def is_chargeback_escalation(self):
        return self.stage == self.Stages.CHARGEBACK_ESCALATION


class StageChangesHistory(BaseModel):
    AUTOMATICALLY = '??????????????????????'

    status_from = models.ForeignKey(Status, on_delete=models.CASCADE, related_name='history_status_from')
    status_to = models.ForeignKey(Status, on_delete=models.CASCADE, related_name='history_status_to')
    claim = models.ForeignKey(Claim, on_delete=models.CASCADE, related_name='stages')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    reason = models.CharField(max_length=999, default=AUTOMATICALLY)
    status = models.ForeignKey(Status, on_delete=models.CASCADE)


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
    claim_document = models.ForeignKey(ClaimDocument, on_delete=models.CASCADE, blank=True, null=True)
    log = models.FileField(storage=LogsRootS3Boto3Storage())
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
