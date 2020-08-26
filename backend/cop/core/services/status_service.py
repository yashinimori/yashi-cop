"""Keep service clean and small."""

from django.apps import apps

from django.contrib.auth import get_user_model

Status = apps.get_model('core', 'Status')
Claim = apps.get_model('core', 'Claim')
User = get_user_model()


class BaseStatusService:
    """Change Claim status according to users actions."""
    statuses = Status.objects.all()
    claim: Claim
    current_status = None
    user: User
    initial_status: int
    form_name: str

    def __init__(self, claim, user: User, status_index=None):
        self.claim = claim
        self.user = user
        self.initial_status = self.claim.status.index or 0
        if status_index:  # we already know which status it should be
            self.claim.status = self.statuses.get(index=status_index)
        elif not self.claim.status:
            self.claim.status = 1
        else:  # we don't know which status, start analysing
            self.start()
        claim.save()

    def start(self):
        """Decide which stage to select based on user and claim data."""
        stages = {
            Status.Stages.PRE_MEDIATION: self.pre_mediation,
            Status.Stages.MEDIATION: self.mediation,
            Status.Stages.CHARGEBACK: self.chargeback,
            Status.Stages.CHARGEBACK_ESCALATION: self.chargeback_escalation,
            Status.Stages.DISPUTE: self.dispute,
            Status.Stages.DISPUTE_RESPONSE: self.dispute_response,
            Status.Stages.PRE_ARBITRATION: self.pre_arbitration,
            Status.Stages.PRE_ARBITRATION_RESPONSE: self.pre_arbitration_response,
            Status.Stages.ARBITRATION: self.arbitration,
            Status.Stages.FINAL_RULING: self.final_ruling,
            Status.Stages.CLOSED: self.closed,
        }
        stages[self.claim.status.stage]()

    def claim_has_merchant_comment(self):
        return self.claim.comments.filter(user__role=User.Roles.MERCHANT).count() >= 1

    def claim_has_chb_officer_comment(self):
        return self.claim.comments.filter(user__role=User.Roles.CHARGEBACK_OFFICER).count() >= 1

    def set_status(self, status_index: int):
        self.claim.status = Status.objects.get(index=status_index)

    def pre_mediation(self):
        pass

    def mediation(self):
        pass

    def chargeback(self):
        pass

    def chargeback_escalation(self):
        pass

    def dispute(self):
        pass

    def dispute_response(self):
        pass

    def pre_arbitration(self):
        pass

    def pre_arbitration_response(self):
        pass

    def arbitration(self):
        pass

    def final_ruling(self):
        pass

    def closed(self):
        pass


class StatusService(BaseStatusService):

    def pre_mediation(self):
        if self.initial_status == 2:
            if self.user.is_merchant:
                if self.claim.close_form_received:
                    self.set_status(4)
        elif self.initial_status == 4:
            if self.user.is_cardholder:
                if self.claim.close_form_received:
                    self.set_status(51)
                elif self.claim.escalation_form_received:
                    self.set_status(5)

    def mediation(self):
        if self.initial_status == 5:
            if self.user.is_cardholder:
                if self.claim.survey_form_received:
                    self.set_status(6)
        if self.initial_status == 6:
            if self.user.is_merchant:
                if self.claim.close_form_received:
                    self.set_status(8)
        elif self.initial_status == 8:
            if self.user.is_cardholder:
                if self.claim.close_form_received:
                    self.set_status(51)
                elif self.claim.escalation_form_received:
                    self.set_status(17)

    def chargeback(self):
        """ 9-25 statuses """
        if self.initial_status == 17:
            if self.user.is_chargeback_officer:
                if self.claim.escalation_form_received:
                    self.set_status(19)
                elif self.claim.close_form_received:
                    self.set_status(23)
                elif self.claim.clarify_form_received:
                    self.set_status(18)
        elif self.initial_status == 18:
            if self.user.is_cardholder:
                if self.claim.close_form_received:
                    self.set_status(51)
                elif self.claim.escalation_form_received:
                    self.set_status(17)
        elif self.initial_status == 19:
            if self.user.is_chargeback_officer:
                if self.claim.escalation_form_received:
                    self.set_status(21)
                elif self.claim.query_form_received:
                    self.set_status(20)
        elif self.initial_status == 20:
            if self.user.is_merchant:
                if self.claim.close_form_received:
                    self.set_status(19)
        elif self.initial_status == 21:
            if self.user.is_chargeback_officer:
                if self.claim.clarify_form_received:
                    self.set_status(27)
                elif self.claim.close_form_received and self.claim.officer_answer_refund:
                    self.set_status(14)
                elif self.claim.close_form_received:
                    self.set_status(23)
        elif self.initial_status == 22:
            if self.user.is_chargeback_officer:
                if self.claim.close_form_received:
                    self.set_status(14)
        elif self.initial_status == 25:
            if self.user.is_cardholder:
                if self.claim.close_form_received:
                    self.set_status(51)
        elif self.initial_status == 23:
            if self.user.is_chargeback_officer:
                if self.claim.close_form_received:
                    self.set_status(24)
        elif self.initial_status == 24:
            if self.user.is_cardholder:
                if self.claim.close_form_received:
                    self.set_status(51)

    def chargeback_escalation(self):
        """ 26-29 statuses """
        if self.initial_status == 27:
            if self.user.is_cardholder:
                if self.claim.close_form_received:
                    self.set_status(51)
                elif self.claim.clarify_form_received:
                    self.set_status(26)
        elif self.initial_status == 27:
            if self.user.is_chargeback_officer:
                if self.claim.escalation_form_received:
                    self.set_status(31)
                elif self.claim.close_form_received:
                    self.set_status(30)
        elif self.initial_status == 30:
            if self.user.is_chargeback_officer:
                if self.claim.close_form_received:
                    self.set_status(51)
        elif self.initial_status == 31:
            if self.user.is_chargeback_officer:
                if self.claim.escalation_form_received:
                    self.set_status(35)
        elif self.initial_status == 35:
            if self.user.is_chargeback_officer:
                if self.claim.close_form_received and self.claim.officer_answer_refund:
                    self.set_status(34)
                elif self.claim.close_form_received:
                    self.set_status(32)
                elif self.claim.clarify_form_received:
                    self.set_status(40)
        elif self.initial_status == 32:
            if self.user.is_cardholder:
                if self.claim.close_form_received:
                    self.set_status(46)
        elif self.initial_status == 33:
            if self.user.is_chargeback_officer:
                if self.claim.close_form_received:
                    self.set_status(34)
        elif self.initial_status == 34:
            if self.user.is_chargeback_officer:
                if self.claim.close_form_received:
                    self.set_status(32)
            if self.user.is_cardholder:
                if self.claim.close_form_received:
                    self.set_status(51)
        elif self.initial_status == 40:
            if self.user.is_cardholder:
                if self.claim.close_form_received:
                    self.set_status(51)
                elif self.claim.clarify_form_received:
                    self.set_status(39)
        elif self.initial_status == 39:
            if self.user.is_chargeback_officer:
                if self.claim.escalation_form_received:
                    self.set_status(47)
                elif self.claim.close_form_received:
                    self.set_status(46)
        elif self.initial_status == 46:
            if self.user.is_cardholder:
                if self.claim.close_form_received:
                    self.set_status(51)
        elif self.initial_status == 46:
            if self.user.is_chargeback_officer:
                if self.claim.escalation_form_received:
                    self.set_status(42)
        elif self.initial_status == 42:
            if self.user.is_chargeback_officer:
                if self.claim.close_form_received and self.claim.officer_answer_refund:
                    self.set_status(48)
                elif self.claim.close_form_received:
                    self.set_status(49)
        elif self.initial_status == 48:
            if self.user.is_chargeback_officer:
                if self.claim.close_form_received:
                    self.set_status(49)
            elif self.user.is_cardholder:
                if self.claim.close_form_received:
                    self.set_status(51)
        elif self.initial_status == 49:
            if self.user.is_cardholder:
                if self.claim.close_form_received:
                    self.set_status(51)


class AllocationStatusService(BaseStatusService):

    def pre_mediation(self):
        if self.initial_status == 2:
            if self.user.is_merchant:
                if self.claim.close_form_received:
                    self.set_status(4)
        elif self.initial_status == 4:
            if self.user.is_cardholder:
                if self.claim.close_form_received:
                    self.set_status(51)
                elif self.claim.escalation_form_received:
                    self.set_status(5)

    def mediation(self):
        if self.initial_status == 5:
            if self.user.is_cardholder:
                if self.claim.survey_form_received:
                    self.set_status(6)
        if self.initial_status == 6:
            if self.user.is_merchant:
                if self.claim.close_form_received:
                    self.set_status(8)
        elif self.initial_status == 8:
            if self.user.is_cardholder:
                if self.claim.close_form_received:
                    self.set_status(51)
                elif self.claim.escalation_form_received:
                    self.set_status(9)

    def chargeback(self):
        if self.initial_status == 9:
            if self.user.is_chargeback_officer:
                if self.claim.escalation_form_received:
                    self.set_status(11)
                elif self.claim.close_form_received:
                    self.set_status(15)
                elif self.claim.clarify_form_received:
                    self.set_status(10)
        elif self.initial_status == 10:
            if self.user.is_cardholder:
                if self.claim.close_form_received:
                    self.set_status(51)
                elif self.claim.escalation_form_received:
                    self.set_status(9)
        elif self.initial_status == 11:
            if self.user.is_chargeback_officer:
                if self.claim.escalation_form_received:
                    self.set_status(26)
                elif self.claim.clarify_form_received:
                    self.set_status(12)
        elif self.initial_status == 12:
            if self.user.is_merchant:
                if self.claim.close_form_received:
                    self.set_status(11)
        elif self.initial_status == 13:
            if self.user.is_chargeback_officer:
                if self.claim.close_form_received and self.claim.officer_answer_refund:
                    self.set_status(14)
                if self.claim.close_form_received:
                    self.set_status(15)
        elif self.initial_status == 14:
            if self.user.is_cardholder:
                if self.claim.close_form_received:
                    self.set_status(51)
        elif self.initial_status == 15:
            if self.user.is_chargeback_officer:
                if self.claim.close_form_received:
                    self.set_status(16)
            if self.user.is_cardholder:
                if self.claim.close_form_received:
                    self.set_status(51)

    def chargeback_escalation(self):
        if self.initial_status == 26:
            if self.user.is_chargeback_officer:
                if self.claim.clarify_form_received:
                    self.set_status(27)
                elif self.claim.close_form_received and self.claim.officer_answer_refund:
                    self.set_status(14)
                elif self.claim.close_form_received:
                    self.set_status(28)
                elif self.claim.escalation_form_received:
                    self.set_status(35)
        elif self.initial_status == 27:
            if self.user.is_cardholder:
                if self.claim.escalation_form_received:
                    self.set_status(26)
                elif self.claim.close_form_received:
                    self.set_status(51)
        elif self.initial_status == 28:
            if self.user.is_cardholder:
                if self.claim.close_form_received:
                    self.set_status(51)
        elif self.initial_status == 36:
            if self.user.is_chargeback_officer:
                if self.claim.close_form_received:
                    self.set_status(37)
            elif self.user.is_cardholder:
                if self.claim.close_form_received:
                    self.set_status(51)
        elif self.initial_status == 37:
            if self.user.is_chargeback_officer:
                if self.claim.close_form_received:
                    self.set_status(38)
        elif self.initial_status == 38:
            if self.user.is_cardholder:
                if self.claim.close_form_received:
                    self.set_status(51)
        elif self.initial_status == 35:
            if self.user.is_chargeback_officer:
                if self.claim.escalation_form_received:
                    self.set_status(39)
        elif self.initial_status == 39:
            if self.user.is_chargeback_officer:
                if self.claim.clarify_form_received:
                    self.set_status(40)
                elif self.claim.close_form_received and self.claim.officer_answer_refund:  # TODO status dasn't exist
                    self.set_status(43)
                elif self.claim.close_form_received:
                    self.set_status(41)
                elif self.claim.escalation_form_received:
                    self.set_status(42)
        elif self.initial_status == 40:
            if self.user.is_cardholder:
                if self.claim.escalation_form_received:
                    self.set_status(39)
                elif self.claim.close_form_received:
                    self.set_status(51)
        elif self.initial_status == 41:
            if self.user.is_cardholder:
                if self.claim.close_form_received:
                    self.set_status(51)
        elif self.initial_status == 41:
            if self.user.is_chargeback_officer:
                if self.claim.close_form_received:
                    self.set_status(44)
        elif self.initial_status == 43:
            if self.user.is_cardholder:
                if self.claim.close_form_received:
                    self.set_status(51)
        elif self.initial_status == 44:
            if self.user.is_chargeback_officer:
                if self.claim.close_form_received:
                    self.set_status(45)
        elif self.initial_status == 45:
            if self.user.is_cardholder:
                if self.claim.close_form_received:
                    self.set_status(51)


class CardholderStatuses(BaseStatusService):
    def closed(self):
        if self.initial_status == 50 and self.user.is_cardholder:
            self.set_status(51)


