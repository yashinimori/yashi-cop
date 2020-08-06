from django.contrib.auth import get_user_model
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
    merchant_id = models.CharField(max_length=15)
    merchant_name_legal = models.CharField(max_length=999)
    mcc = models.CharField(max_length=4)
    description = models.CharField(max_length=999)
    telephone = models.CharField(max_length=13)
    email = models.EmailField(max_length=999)
    merchant_name_ips = models.CharField(max_length=999)
    address = models.CharField(max_length=999)
    terminal_id = models.CharField(max_length=8)
    contact_person = models.CharField(max_length=999)

    def __str__(self):
        return self.merchant_name_legal


class Terminal(BaseModel):
    terminal_id = models.CharField(max_length=999)
    merchant = models.ForeignKey(Merchant, on_delete=models.PROTECT)


class Stage(BaseModel):
    # TODO change to ChoiceField
    name = models.CharField(max_length=999)


class Transaction(BaseModel):
    bank = models.ForeignKey(Bank, on_delete=models.PROTECT, blank=True, null=True)
    terminal = models.ForeignKey(Terminal, on_delete=models.CASCADE, null=True, blank=True)
    merchant = models.ForeignKey(Merchant, on_delete=models.PROTECT)
    pan = models.CharField(max_length=16, null=True, blank=True)
    trans_amount = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True)
    trans_currency = models.CharField(max_length=3, null=True, blank=True)
    auth_code = models.CharField(max_length=6, null=True, blank=True)
    approval_code = models.CharField(max_length=6, null=True, blank=True)
    cash_count = models.CharField(max_length=999, null=True, blank=True)
    error = models.CharField(max_length=999, null=True, blank=True)
    result = models.CharField(max_length=999, null=True, blank=True)

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

    source = models.CharField(max_length=999, null=True, blank=True)
    arn = models.CharField(max_length=23, null=True, blank=True)
    flag = models.CharField(max_length=999, null=True, blank=True)

    merchant = models.ForeignKey(Merchant, on_delete=models.PROTECT)
    bank = models.ForeignKey(Bank, on_delete=models.PROTECT, blank=True, null=True)
    terminal = models.ForeignKey(Terminal, on_delete=models.CASCADE, blank=True, null=True)
    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE, blank=True, null=True)
    reason_code_group = models.CharField(max_length=23, blank = True, null = True)
    action_needed = models.CharField(max_length=999)
    comment = models.TextField(null=True, blank=True)

    stage = models.ForeignKey(Stage, on_delete=models.PROTECT)
    result = models.CharField(choices=RESULTS_CHOICES, max_length=999, blank=True, null=True)
    support = models.CharField(choices=SUPPORT_CHOICES, max_length=999, blank=True, null=True)

    answers = JSONField(max_length=999, blank=True, null=True)
    reason_code = models.CharField(max_length=999, blank=True, null=True)

    due_date = models.DateTimeField(null=True, blank=True)
    dispute_date = models.DateTimeField(null=True, blank=True)


class Document(BaseModel):
    transaction = models.ForeignKey('Claim', on_delete=models.CASCADE, related_name='documents')
    description = models.CharField(max_length=255, blank=True)
    document = models.FileField(upload_to='documents/')


class Comment(BaseModel):
    transaction = models.ForeignKey('Claim', on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()

    def __str__(self):
        return self.text
