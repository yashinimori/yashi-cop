"""Keep service clean and small."""

from django.apps import apps
from django.contrib.auth import get_user_model

Status = apps.get_model('core', 'Status')
User = get_user_model()


class StatusService:
    """Change Claim status according to users actions."""
    statuses = Status.objects.all()
    claim = None
    current_status = None
    user: User
    initial_status: int
    form_name: str

    def __init__(self, claim, user: User, status_index=None):
        self.claim = claim
        self.user = user
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

    def pre_mediation(self):
        if self.claim.merchant and self.user.is_merchant and self.form_name == 'Запит доков':
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
