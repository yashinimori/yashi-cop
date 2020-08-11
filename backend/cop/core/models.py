from django.contrib.auth import get_user_model
from django.contrib.contenttypes.fields import GenericRelation, GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.contrib.postgres.fields import JSONField
from django.db import models

User = get_user_model()


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

    bin = models.CharField(max_length=8)
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


class Merchant(BaseModel):
    bank = models.ForeignKey(Bank, on_delete=models.PROTECT, blank=True, null=True)
    merch_id = models.CharField(max_length=15, unique=True)
    name_legal = models.CharField(max_length=999, blank=True, null=True)
    bin = models.CharField(max_length=999, blank=True, null=True)
    name_ips = models.CharField(max_length=999, blank=True, null=True)
    mcc = models.CharField(max_length=4, blank=True, null=True)
    description = models.CharField(max_length=999, blank=True, null=True)
    telephone = models.CharField(max_length=13, blank=True, null=True)
    email = models.EmailField(max_length=999, blank=True, null=True)
    address = models.CharField(max_length=999, blank=True, null=True)
    terminal_id = models.CharField(max_length=8, blank=True, null=True)
    contact_person = models.CharField(max_length=999, blank=True, null=True)

    def __str__(self):
        return self.name_legal


class Terminal(BaseModel):
    term_id = models.CharField(max_length=999, unique=True)
    address = models.CharField(max_length=999, blank=True, null=True)
    merchant = models.ForeignKey(Merchant, on_delete=models.PROTECT)


class Stage(BaseModel):
    PRE_MEDIATION = 'pre_mediation'
    MEDIATION = 'mediation'
    CHARGEBACK = 'chargeback'
    CHARGEBACK_ESCALATION = 'chargeback_escalation'

    STAGE_CHOICES = (
        (PRE_MEDIATION, PRE_MEDIATION),
        (MEDIATION, MEDIATION),
        (CHARGEBACK, CHARGEBACK),
        (CHARGEBACK_ESCALATION, CHARGEBACK_ESCALATION),
    )
    stage = models.CharField(choices=STAGE_CHOICES, default=PRE_MEDIATION, max_length=999)
    name = models.CharField(max_length=999)


class Document(BaseModel):
    content_type = models.ForeignKey(ContentType, blank=True, null=True, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField(blank=True, null=True)
    bound_to = GenericForeignKey('content_type', 'object_id')
    description = models.CharField(max_length=255, null=True, blank=True)
    file = models.FileField(upload_to='documents/', null=True, blank=True)


class Transaction(BaseModel):
    bank = models.ForeignKey(Bank, on_delete=models.PROTECT, blank=True, null=True)
    terminal = models.ForeignKey(Terminal, on_delete=models.CASCADE, null=True, blank=True)
    merchant = models.ForeignKey(Merchant, on_delete=models.PROTECT, null=True, blank=True)
    pan = models.CharField(max_length=16, null=True, blank=True)
    trans_amount = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True)
    trans_currency = models.CharField(max_length=3, null=True, blank=True)
    auth_code = models.CharField(max_length=6, null=True, blank=True)
    approval_code = models.CharField(max_length=6, null=True, blank=True)
    cash_count = models.CharField(max_length=999, null=True, blank=True)
    error = models.CharField(max_length=999, null=True, blank=True)
    result = models.CharField(max_length=999, null=True, blank=True)
    mcc = models.CharField(max_length=999, null=True, blank=True)

    trans_start = models.DateTimeField(max_length=12, null=True, blank=True)
    trans_end = models.DateTimeField(max_length=12, null=True, blank=True)
    pin_entered = models.DateTimeField(max_length=12, null=True, blank=True)
    cash_request = models.DateTimeField(max_length=12, null=True, blank=True)
    cash_presented = models.DateTimeField(max_length=12, null=True, blank=True)
    cash_retracted = models.DateTimeField(max_length=12, null=True, blank=True)
    cash_taken = models.DateTimeField(max_length=12, null=True, blank=True)
    card_taken = models.DateTimeField(max_length=12, null=True, blank=True)


class Claim(BaseModel):
    RESULTS_CHOICES = (
        ('successful', 'Successful'),
        ('failed', 'Failed'),
        ('neutral', 'Neutral'),
    )
    SUPPORT_CHOICES = (
        ('one_them_chargeback', 'One them chargebacks'),
        ('on_us_chargeback', 'On us chargeback'),
        ('us_on_us', 'Us on us'),
        ('fraud', 'Fraud'),
    )

    user = models.ForeignKey(User, related_name='claim_users', on_delete=models.CASCADE, blank=True, null=True)
    mediator = models.ForeignKey(User, related_name='claim_mediators', on_delete=models.CASCADE, blank=True, null=True)

    first_name = models.CharField(max_length=999, null=True, blank=True)
    last_name = models.CharField(max_length=999, null=True, blank=True)
    email = models.CharField(max_length=999, null=True, blank=True)
    telephone = models.CharField(max_length=999, null=True, blank=True)
    issuer_mmt = models.CharField(max_length=40, null=True, blank=True)
    dispute_mmt = models.CharField(max_length=40, null=True, blank=True)
    ch_mmt = models.CharField(max_length=999, null=True, blank=True)
    merchant_mmt = models.CharField(max_length=999, null=True, blank=True)

    source = models.CharField(max_length=999, null=True, blank=True)
    arn = models.CharField(max_length=23, null=True, blank=True)
    flag = models.CharField(max_length=999, null=True, blank=True)

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
    terminal = models.ForeignKey(
        Terminal,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name='terminals',
    )
    transaction = models.ForeignKey(
        Transaction,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name='transactions',
    )

    pan = models.CharField(max_length=16, null=True, blank=True)
    merch_id = models.CharField(max_length=999, null=True, blank=True)
    term_id = models.CharField(max_length=999, null=True, blank=True)

    reason_code_group = models.CharField(max_length=99, blank = True, null = True)
    action_needed = models.CharField(max_length=999, null=True, blank=True)
    comment = models.TextField(null=True, blank=True)
    ch_comments = models.TextField(null=True, blank=True)
    bank_comments = models.TextField(null=True, blank=True)
    merchant_comments = models.TextField(null=True, blank=True)

    stage = models.ForeignKey(Stage, on_delete=models.PROTECT)
    result = models.CharField(choices=RESULTS_CHOICES, max_length=999, blank=True, null=True)
    support = models.CharField(choices=SUPPORT_CHOICES, max_length=999, blank=True, null=True)

    answers = JSONField(max_length=999, blank=True, null=True)
    reason_code = models.CharField(max_length=999, blank=True, null=True)

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
    documents = GenericRelation(Document, related_query_name='claims', null=True, blank=True)


class Comment(BaseModel):
    transaction = models.ForeignKey('Claim', on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()

    def __str__(self):
        return self.text


class SurveyQuestion(BaseModel):
    description = models.CharField(max_length=999)
