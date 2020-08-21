"""Keep service clean and small."""
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist

from cop.core.utils.claim_reason_codes import ClaimReasonCodes as crc
from cop.core.utils.save_transaction_pdf import save_transaction_pdf

User = get_user_model()


MASTERCARD_START_NUMBERS = [5, 6]
VISA_START_NUMBERS = [4]


class ClaimRoutingService:
    claim = None
    user: User

    def __init__(self, claim, user, **kwargs):
        self.claim = claim
        self.user = user
        self.set_merchant_and_bank(kwargs)
        self.claim.save()

    def set_merchant_and_bank(self, validated_data):
        """Try to set Merchant/Bank/Terminal."""
        if 'term_id' in validated_data:
            self.assign_by_term_id(validated_data['term_id'])
        elif 'merch_id' in validated_data:
            self.assign_by_merch_id(validated_data['merch_id'])

        self.assign_rc_by_claim_rc(validated_data['claim_reason_code'])
        self.assign_bank_by_pan()
        self.assign_transaction()

    def assign_by_merch_id(self, merch_id):
        from cop.core.models import Merchant
        merchant = Merchant.objects.filter(merch_id=merch_id).first()
        if merchant:
            self.claim.merchant = merchant
            if merchant.terminals.count() == 1:
                self.claim.terminal = merchant.terminals.first()

    def assign_by_term_id(self, term_id):
        from cop.core.models import Terminal
        terminal = Terminal.objects.filter(term_id=term_id).first()
        if terminal:
            self.claim.terminal = terminal
            self.claim.merchant = terminal.merchant

    def assign_rc_by_claim_rc(self, claim_reason_code):
        self.claim.reason_code_group = claim_reason_code.description

        if int(self.claim.pan[0]) in MASTERCARD_START_NUMBERS:
            self.claim.reason_code = claim_reason_code.mastercard
        elif int(self.claim.pan[0]) in VISA_START_NUMBERS:
            self.claim.reason_code = claim_reason_code.visa

        try:
            operations = crc.CLAIM_REASON_CODES[claim_reason_code.code]
            for operation in operations:
                operation(self.claim, claim_reason_code.code)
        except (KeyError, TypeError):
            pass

    def assign_bank_by_pan(self):
        from cop.core.models import Bank

        bank_bin = self.claim.pan[0:6]
        try:
            self.claim.bank = Bank.objects.get(bin=bank_bin)
        except ObjectDoesNotExist:
            pass

    def assign_transaction(self):
        from cop.core.models import Transaction

        approval_code = self.claim.trans_approval_code
        qs = Transaction.objects.filter(pan__startswith=self.claim.pan[0:6], pan__endswith=self.claim.pan[-4:],
                                        trans_amount=self.claim.trans_amount, trans_date=self.claim.trans_date)
        if approval_code:
            qs.filter(approval_code=approval_code)
        transaction = qs.first()
        if transaction:
            self.claim.transaction = transaction
            self.claim.result = transaction.result
            if self.claim.result == Transaction.Results.SUCCESSFUL:
                self.change_stage_add_comment(transaction)

    def change_stage_add_comment(self, transaction):
        from cop.core.models import ClaimDocument, Comment

        media_path = save_transaction_pdf(transaction)
        system_user = User.objects.get(email='system@cop.cop')
        ClaimDocument.objects.create(
            type=ClaimDocument.Types.ATM_LOG,
            file=media_path,
            claim=self.claim,
            user=system_user
        )
        Comment.objects.create(
            text='згідно проведеного аналізу операція була завершена успішно, кошти були отримані',
            user=system_user,
            claim=self.claim
        )
