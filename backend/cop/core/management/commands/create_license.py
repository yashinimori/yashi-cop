from django.core.management.base import BaseCommand
from cop.core.models import License


class Command(BaseCommand):
    help = 'Create License'

    def handle(self, *args, **kwargs):

        license_names = ('Basic', 'Standard', 'Premium', 'Custom')
        step = None

        # Base parameters (for Premium)
        license_cost = 1000
        implemented_cost = 2500
        per_user_fee = 50
        per_officer_fee = 300
        officers_before_cost_up = 3
        per_officer_up_fee = 400
        per_merchant_fee = 500
        merchants_before_cost_up = 500
        per_merchant_up_fee = 1000
        per_atm_fee = 800
        per_pre_mediation_fee = 45
        pre_mediation_before_cost_up = 1000
        per_pre_mediation_up_fee = 60
        per_mediation_fee = 40
        mediation_before_cost_up = 1000
        per_mediation_up_fee = 55
        per_chargeback_fee = 80
        chargeback_before_cost_up = 1000
        per_chargeback_up_fee = 100
        per_us_on_us_fee = 40
        us_on_us_before_cost_up = 1000
        per_us_on_us_up_fee = 59.99

        for license_name in license_names:
            if license_name == 'Basic':
                step = 200
            elif license_name == 'Standard':
                step = 100
            elif license_name == 'Premium':
                step = 0
            elif license_name == 'Custom':
                step = 50
            License.objects.create(type_license=license_name,
                                   license_cost=license_cost + step,
                                   implemented_cost=implemented_cost + step,
                                   per_user_fee=per_user_fee + step,
                                   per_officer_fee=per_officer_fee + step,
                                   officers_before_cost_up=officers_before_cost_up,
                                   per_officer_up_fee=per_officer_up_fee + step,
                                   per_merchant_fee=per_merchant_fee + step,
                                   merchants_before_cost_up=merchants_before_cost_up,
                                   per_merchant_up_fee=per_merchant_up_fee + step,
                                   per_atm_fee=per_atm_fee + step,
                                   per_pre_mediation_fee=per_pre_mediation_fee + step,
                                   pre_mediation_before_cost_up=pre_mediation_before_cost_up,
                                   per_pre_mediation_up_fee=per_pre_mediation_up_fee + step,
                                   per_mediation_fee=per_mediation_fee + step,
                                   mediation_before_cost_up=mediation_before_cost_up,
                                   per_mediation_up_fee=per_mediation_up_fee + step,
                                   per_chargeback_fee=per_chargeback_fee + step,
                                   chargeback_before_cost_up=chargeback_before_cost_up,
                                   per_chargeback_up_fee=per_chargeback_up_fee + step,
                                   per_us_on_us_fee=per_us_on_us_fee + step,
                                   us_on_us_before_cost_up=us_on_us_before_cost_up,
                                   per_us_on_us_up_fee=per_us_on_us_up_fee + step)
