"""Keep service clean and small."""
from datetime import timedelta

from django.apps import apps

from django.contrib.auth import get_user_model
from django.utils.timezone import now

from cop.core.tasks import claim_reminder_notification, revoke_tasks, acquirer_reminder_notification, \
    issuer_reminder_notification, archive_claim
from cop.core.models import StageChangesHistory

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
    is_created: bool

    def __init__(self, claim, user: User, status_index=None, is_created=False):
        self.claim = claim
        self.user = user
        self.initial_status = self.claim.status.index
        self.is_created = is_created
        if is_created:
            if self.initial_status == 2 or self.initial_status == 6 and self.claim.merchant:
                self.create_merchant_notifications()
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

        StageChangesHistory.objects.create(
            status_from=Status.objects.get(index=self.initial_status),
            status_to=Status.objects.get(index=status_index),
            claim=self.claim,
            user=self.user,
            status=self.claim.status
        )
        if status_index == 51:
            self.claim.action_needed = False
            self.clean_previous_tasks()

    def create_cardholder_notifications(self):
        """Revoke previous notification tasks and create new one."""
        self.clean_previous_tasks()
        self.claim.replier = self.claim.user
        self.claim.due_date = now() + timedelta(days=21)
        notify_at_day = [6, 13, 20]
        # send notification to cardholder at 7, 14, 20 day after claim creation
        args = (self.claim.id, self.claim.user.email)
        self.create_notifications(notify_at_day, args)
        self.create_archive_claim_task()

    def create_merchant_notifications(self):
        """Revoke previous notification tasks and create new one."""
        self.clean_previous_tasks()
        self.claim.replier = self.claim.merchant.user
        self.claim.due_date = now() + timedelta(days=7)
        notify_at_day = [3, 5]
        merchant_args = (self.claim.id, self.claim.merchant.user.email)
        # send notification to merchant at 4, 6 day after claim creation
        self.create_notifications(notify_at_day, merchant_args)
        self.create_acquirer_notifications()

    def create_acquirer_notifications(self):
        """Notify Acquirer if Merchant did not answer."""
        acquirer = self.claim.bank.employee_banks.filter(user__role=User.Roles.CHARGEBACK_OFFICER).first()
        issuer = self.claim.bank.employee_banks.filter(user__role=User.Roles.CHARGEBACK_OFFICER).first()

        if self.claim.status.is_mediation and acquirer:
            # if merchant doesn't answer in 7 days send notification to acquirer and stage is Mediation
            acquirer_args = (self.claim.id, acquirer.user.email)
            acquirer_reminder_notification.apply_async(acquirer_args, eta=self.claim.due_date)

            # if acquirer won't answer in due_date + 7 date notify card issuer (эмитента)
            if issuer:
                issuer_args = (self.claim.id, issuer.user.email)
                acquirer_due_date = self.claim.due_date + timedelta(days=7)
                issuer_reminder_notification.apply_async(issuer_args, eta=acquirer_due_date)
        if self.claim.status.is_chargeback or self.claim.status.is_chargeback_escalation and acquirer:
            self.clean_previous_tasks()
            self.claim.due_date = now() + timedelta(days=45)
            # if acquirer doesn't answer in 45 days send notification to шыыгу and stage is Mediation
            acquirer_args = (self.claim.id, acquirer.user.email)
            acquirer_reminder_notification.apply_async(acquirer_args)

            # if acquirer won't answer in due_date + 7 date notify card issuer (эмитента)
            if issuer:
                issuer_args = (self.claim.id, issuer.user.email)
                issuer_reminder_notification.apply_async(issuer_args, eta=self.claim.due_date)

    def clean_previous_tasks(self):
        """Revoke all notification tasks."""
        self.claim.reminder_task_ids = revoke_tasks(self.claim.reminder_task_ids or [])

    def create_notifications(self, notify_at_day, args):
        task_ids = []
        for days in notify_at_day:
            eta = now() + timedelta(days=days)
            task = claim_reminder_notification.apply_async(args, eta=eta)
            task_ids.append(task.id)
        notify_now = claim_reminder_notification.apply_async(args, countdown=3)
        self.claim.reminder_task_ids = task_ids

    def create_archive_claim_task(self):
        eta = now() + timedelta(days=30)
        task = archive_claim.apply_async((self.claim.id,), eta=eta)
        self.claim.reminder_task_ids.append(task.id)

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


class StatusServiceLite(BaseStatusService):
    def pre_mediation(self):
        if self.is_created == True:
            self.claim.due_date = now() + timedelta(days=7)
        if self.user.is_cardholder:
            if self.claim.escalation_form_received:
                self.set_status(6)
                self.create_merchant_notifications()
            elif self.claim.close_form_received:
                self.set_status(51)

    def mediation(self):
        if self.is_created == True:
            self.claim.due_date = now() + timedelta(days=10)
        if self.user.is_cardholder:
            if self.claim.escalation_form_received:
                self.set_status(17)
                self.create_acquirer_notifications()
            elif self.claim.close_form_received:
                self.set_status(51)
        if self.user.is_chargeback_officer:
            if self.claim.close_form_received:
                self.set_status(51)

    def chargeback(self):
        if self.user.is_cardholder:
            if self.claim.close_form_received:
                self.set_status(51)
        if self.user.is_chargeback_officer:
            if self.claim.escalation_form_received:
                self.set_status(27)
                self.create_acquirer_notifications()
            if self.claim.close_form_received:
                self.set_status(51)

    def chargeback_escalation(self):
        if self.user.is_cardholder:
            if self.claim.close_form_received:
                self.set_status(51)
        if self.user.is_chargeback_officer:
            if self.claim.close_form_received:
                self.set_status(51)


class StatusService(BaseStatusService):

    def pre_mediation(self):
        if self.is_created == True:
            self.claim.due_date = now() + timedelta(days=7)
        if self.initial_status == 2:
            if self.user.is_merchant:
                if self.claim.close_form_received:
                    self.set_status(4)
                    self.create_cardholder_notifications()
        elif self.initial_status == 4:
            if self.user.is_cardholder:
                if self.claim.close_form_received:
                    self.set_status(51)
                elif self.claim.escalation_form_received:
                    self.set_status(5)
                    self.create_cardholder_notifications()

    def mediation(self):
        if self.is_created == True:
            self.claim.due_date = now() + timedelta(days=10)
        if self.initial_status == 5:
            if self.user.is_cardholder:
                if self.claim.escalation_form_received:
                    self.set_status(6)
                    self.create_merchant_notifications()
        if self.initial_status == 6:
            if self.user.is_merchant:
                if self.claim.close_form_received:
                    self.set_status(8)
                    self.create_cardholder_notifications()
        elif self.initial_status == 8:
            if self.user.is_cardholder:
                if self.claim.close_form_received:
                    self.set_status(51)
                elif self.claim.escalation_form_received:
                    self.set_status(17)
                    self.claim.chargeback_date = now()
                    self.create_acquirer_notifications()

    def chargeback(self):
        """ 17-24 statuses """
        if self.initial_status == 17:
            if self.user.is_chargeback_officer:
                if self.claim.escalation_form_received:
                    self.set_status(19)
                elif self.claim.close_form_received:
                    self.set_status(23)
                elif self.claim.clarify_form_received:
                    self.set_status(18)
                    self.create_cardholder_notifications()
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
                    self.claim.second_presentment_date = now()
                    self.set_status(27)
                    self.create_cardholder_notifications()
                    self.create_acquirer_notifications()
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
                    self.create_cardholder_notifications()
        elif self.initial_status == 24:
            if self.user.is_cardholder:
                if self.claim.close_form_received:
                    self.set_status(51)

    def chargeback_escalation(self):
        """ 27-49 statuses """
        if self.initial_status == 27:
            if self.user.is_cardholder:
                if self.claim.close_form_received:
                    self.set_status(51)
                elif self.claim.clarify_form_received:
                    self.set_status(26)
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
                    self.create_cardholder_notifications()
                elif self.claim.close_form_received:
                    self.set_status(32)
                    self.create_cardholder_notifications()
                elif self.claim.clarify_form_received:
                    self.set_status(40)
                    self.create_cardholder_notifications()
        elif self.initial_status == 32:
            if self.user.is_cardholder:
                if self.claim.close_form_received:
                    self.set_status(46)
        elif self.initial_status == 33:
            if self.user.is_chargeback_officer:
                if self.claim.close_form_received:
                    self.set_status(34)
                    self.create_cardholder_notifications()
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
                    self.create_cardholder_notifications()
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
                    self.create_cardholder_notifications()
                elif self.claim.close_form_received:
                    self.set_status(49)
        elif self.initial_status == 48:
            if self.user.is_chargeback_officer:
                if self.claim.close_form_received:
                    self.set_status(49)
                    self.create_cardholder_notifications()
            elif self.user.is_cardholder:
                if self.claim.close_form_received:
                    self.set_status(51)
        elif self.initial_status == 49:
            if self.user.is_cardholder:
                if self.claim.close_form_received:
                    self.set_status(51)


class AllocationStatusService(BaseStatusService):

    def pre_mediation(self):
        if self.is_created == True:
            self.claim.due_date = now() + timedelta(days=7)
        if self.initial_status == 2:
            if self.user.is_merchant:
                if self.claim.close_form_received:
                    self.set_status(4)
                    self.create_cardholder_notifications()
        elif self.initial_status == 4:
            if self.user.is_cardholder:
                if self.claim.close_form_received:
                    self.set_status(51)
                elif self.claim.escalation_form_received:
                    self.set_status(5)
                    self.create_cardholder_notifications()

    def mediation(self):
        if self.is_created == True:
            self.claim.due_date = now() + timedelta(days=10)
        if self.initial_status == 5:
            if self.user.is_cardholder:
                if self.claim.escalation_form_received:
                    self.create_merchant_notifications()
                    self.set_status(6)
        if self.initial_status == 6:
            if self.user.is_merchant:
                if self.claim.close_form_received:
                    self.set_status(8)
                    self.create_cardholder_notifications()
        elif self.initial_status == 8:
            if self.user.is_cardholder:
                if self.claim.close_form_received:
                    self.set_status(51)
                elif self.claim.escalation_form_received:
                    self.set_status(9)
                    self.create_acquirer_notifications()

    def chargeback(self):
        if self.initial_status == 9:
            if self.user.is_chargeback_officer:
                if self.claim.escalation_form_received:
                    self.set_status(11)
                elif self.claim.close_form_received:
                    self.set_status(15)
                elif self.claim.clarify_form_received:
                    self.set_status(10)
                    self.create_cardholder_notifications()
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
                    self.create_acquirer_notifications()
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
                    self.create_cardholder_notifications()
                elif self.claim.close_form_received and self.claim.officer_answer_refund:
                    self.set_status(14)
                elif self.claim.close_form_received:
                    self.set_status(28)
                    self.create_cardholder_notifications()
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
                    self.create_cardholder_notifications()
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
                    self.create_cardholder_notifications()
                elif self.claim.close_form_received and self.claim.officer_answer_refund:
                    self.set_status(43)
                    self.create_cardholder_notifications()
                elif self.claim.close_form_received:
                    self.set_status(41)
                    self.create_cardholder_notifications()
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
                    self.create_cardholder_notifications()
        elif self.initial_status == 45:
            if self.user.is_cardholder:
                if self.claim.close_form_received:
                    self.set_status(51)


class CardholderStatusService(BaseStatusService):
    def closed(self):
        if self.initial_status == 50 and self.user.is_cardholder:
            self.set_status(51)
