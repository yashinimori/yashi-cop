"""Keep service clean and small."""
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist

from cop.core.models import Claim
from cop.core.utils.claim_reason_codes import ClaimReasonCodes as crc

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
            self.assign_atm(validated_data['merch_id'])

        self.assign_rc_by_claim_rc(validated_data['claim_reason_code'])
        self.assign_bank_by_pan()
        self.claim.assign_transaction()
        self.assign_support()

    def assign_by_merch_id(self, merch_id):
        from cop.users.models import Merchant
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

        if int(self.claim.hidden_pan[0]) in MASTERCARD_START_NUMBERS:
            self.claim.reason_code = claim_reason_code.mastercard
        elif int(self.claim.hidden_pan[0]) in VISA_START_NUMBERS:
            self.claim.reason_code = claim_reason_code.visa

        try:
            operations = crc.CLAIM_REASON_CODES[claim_reason_code.code]
            for operation in operations:
                operation(self.claim, claim_reason_code.code)
        except (KeyError, TypeError):
            pass

    def assign_bank_by_pan(self):
        from cop.core.models import Bank

        bank_bin = self.claim.hidden_pan[0:6]
        try:
            self.claim.bank = Bank.objects.get(bin=bank_bin)
        except ObjectDoesNotExist:
            pass

    def assign_atm(self, merch_id):
        from cop.core.models import ATM
        self.claim.atm = ATM.objects.filter(merch_id=merch_id).first()

    def assign_support(self):
        if self.claim.bank:
            self.claim.support = Claim.Support.US_ON_US if self.claim_bank_is_term_bank() else Claim.Support.US_ON_THEM
        else:
            self.claim.support = Claim.Support.THEM_ON_US

    def assign_support(self):
        if self.claim.bank:
            self.claim.support = Claim.Support.US_ON_US if self.claim_bank_is_term_bank() else Claim.Support.US_ON_THEM
        else:
            self.claim.support = Claim.Support.THEM_ON_US

    def claim_bank_is_term_bank(self):
        return self.claim.bank in self.claim.terminal.merchant.bank.all()
