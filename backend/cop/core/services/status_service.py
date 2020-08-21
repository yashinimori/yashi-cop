"""Keep service clean and small."""

from django.apps import apps
from django.contrib.auth import get_user_model

Status = apps.get_model('core', 'Status')
Claim = apps.get_model('core', 'Claim')
User = get_user_model()


class StatusService:
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
            self.claim.status = self.statuses.get(status_index=status_index)
        elif not self.claim.status:
            self.claim.status = 1
        else:  # we don't know which status, start analysing
            self.start()

        if self.claim.status.index >= self.initial_status:
            self.claim.save()
        else:
            raise Exception('Claim status can\'t be lowered.')

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
        }
        stages[self.claim.status]()

    def claim_has_merchant_comment(self):
        return self.claim.comments.filter(user__role=User.Roles.MERCHANT).count() >= 1

    def claim_has_chb_officer_comment(self):
        return self.claim.comments.filter(user__role=User.Roles.CHARGEBACK_OFFICER).count() >= 1

    def set_status(self, status_index:int):
        self.set_status(status_index)

    def pre_mediation(self):
        """Statuses 1-4"""
        if self.initial_status == 1:
            if self.user.is_merchant:
                if self.claim.clarify_form_received:
                    self.set_status(2)  # Премедиация ответ торговца
        elif self.initial_status == 2:
            if self.user.is_merchant:
                if self.claim.clarify_form_received:
                    self.set_status(4)  # Премедиация ознакомление с результатом
        elif self.initial_status == 4:
            if self.user.is_cardholder:
                if self.claim.close_form_received:
                    self.claim.archived = True
                elif self.claim.escalation_form_received:
                    self.set_status(5)  # Медиация эскалация претензии

    def mediation(self):
        """Statuses 5-8"""
        if self.initial_status == 5:
            if self.user.is_cardholder:
                if self.claim.escalation_form_received:
                    self.set_status(6)  # Медиация ответ торговца
        if self.initial_status == 6:
            if self.user.is_merchant:
                if self.claim.clarify_form_received:
                    self.set_status(8)  # Медиация ознакомление с результатом
        if self.initial_status == 8:
            if self.claim.close_form_received:
                self.claim.archived = True
            elif self.claim.escalation_form_received:
                self.set_status(35)  # Chargeback/Second Presentment передача эмитенту

    def chargeback(self):
        """Statuses 35-42"""
        if self.initial_status == 35:
            if self.user.is_chargeback_officer:
                if self.claim.escalation_form_received:
                    self.set_status(37)  # Chargeback/Second Presentment Опротестование сформировано
                elif self.claim.clarify_form_received:
                    self.set_status(36)  # Chargeback/Second Presentment уточнение претензии
                elif self.claim.close_form_received:
                    self.set_status(41)  # Chargeback/Second Presentment закрытие претензии
        if self.initial_status == 36:
            if self.user.is_cardholder:
                if self.claim.close_form_received:
                    self.claim.archived = True
                if self.claim.escalation_form_received:
                    self.set_status(35)  # Chargeback/Second Presentment передача эмитенту
        if self.initial_status == 37:
            if self.user.is_chargeback_officer:
                if self.claim.escalation_form_received:
                    self.set_status(39)  # Chargeback/Second Presentment ответ на опротестование
                elif self.claim.clarify_form_received:
                    self.set_status(38)  # Chargeback/Second Presentment запрос торговцу
        if self.initial_status == 38:
            if self.user.is_merchant:
                if self.claim.close_form_received:
                    self.set_status(37)  # Chargeback/Second Presentment Опротестование сформировано

        if self.initial_status == 39:
            # TODO: finish
            if self.user.is_chargeback_officer:
                if self.claim.clarify_form_received:
                    self.set_status(14)  # Pre-Abritration уточнение претензии
                if self.claim.escalation_form_received:
                    self.set_status(41)  # Chargeback/Second Presentment закрытие претензии

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
