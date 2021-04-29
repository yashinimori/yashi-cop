import datetime

from django.contrib.auth import get_user_model
from django.db.models import Q, Count
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from cop.core.api.permissions.base import AllowCopManagerPermission, \
    AllowTopLevelPermission, AllowChargebackOfficerPermission
from cop.core.models import Claim, Status, ReasonCodeGroup

from cop.users.models import BankEmployee

from cop.core.api.serializers.bank_employee import BankEmployeeSerializer
from cop.core.api.serializers.bank import BankSerializer

User = get_user_model()


class BankStats(APIView):
    permission_classes = (IsAuthenticated, AllowChargebackOfficerPermission | AllowCopManagerPermission |
                          AllowTopLevelPermission)

    def get(self, request, *args, **kwargs):
        pk = kwargs['pk']
        qs = Claim.objects.filter(bank__id=pk)

        new_claims = qs.filter(chargeback_officer=None).count()
        attend_to_claims = qs.filter(create_date__lte=timezone.now() - datetime.timedelta(days=90)).count()

        annotate_by_status_stage = qs.aggregate(
            pre_mediation=Count('status', filter=Q(status__stage=Status.Stages.PRE_MEDIATION)),
            mediation=Count('status', filter=Q(status__stage=Status.Stages.MEDIATION)),
            chargeback=Count('status', filter=Q(status__stage=Status.Stages.CHARGEBACK)),
            chargeback_escalation=Count('status', filter=Q(status__stage=Status.Stages.CHARGEBACK_ESCALATION)),
            dispute=Count('status', filter=Q(status__stage=Status.Stages.DISPUTE)),
            dispute_response=Count('status', filter=Q(status__stage=Status.Stages.DISPUTE_RESPONSE)),
            pre_arbitration=Count('status', filter=Q(status__stage=Status.Stages.PRE_ARBITRATION)),
            pre_arbitration_response=Count('status', filter=Q(status__stage=Status.Stages.PRE_ARBITRATION_RESPONSE)),
            arbitration=Count('status', filter=Q(status__stage=Status.Stages.ARBITRATION)),
            final_ruling=Count('status', filter=Q(status__stage=Status.Stages.FINAL_RULING)),
            closed=Count('status', filter=Q(status__stage=Status.Stages.CLOSED)),
        )

        annotate_by_rc_group = qs.aggregate(
            fraud=Count('claim_reason_code', filter=(
                Q(claim_reason_code__group_visa=ReasonCodeGroup.Group.FRAUD) | Q(
                claim_reason_code__group_mastercard=ReasonCodeGroup.Group.FRAUD)
            )),
            authorization=Count('claim_reason_code', filter=(
                Q(claim_reason_code__group_visa=ReasonCodeGroup.Group.AUTHORIZATION) | Q(
                claim_reason_code__group_mastercard=ReasonCodeGroup.Group.AUTHORIZATION)
            )),
            point_of_interaction_error=Count('claim_reason_code', filter=(
                Q(claim_reason_code__group_visa=ReasonCodeGroup.Group.POINT_OF_INTERACTION_ERROR) | Q(
                claim_reason_code__group_mastercard=ReasonCodeGroup.Group.POINT_OF_INTERACTION_ERROR)
            )),
            cardholder_disputes=Count('claim_reason_code', filter=(
                Q(claim_reason_code__group_visa=ReasonCodeGroup.Group.CARDHOLDER_DISPUTES) | Q(
                claim_reason_code__group_mastercard=ReasonCodeGroup.Group.CARDHOLDER_DISPUTES)
            )),
        )

        # get bank employee
        bank_employees = User.objects\
            .filter(bankemployee__bank__id=pk)\
            .exclude(
                Q(role=User.Roles.CARDHOLDER) |\
                Q(role=User.Roles.COP_MANAGER)
            )
        # get merchant
        merchants = User.objects.filter(Q(role=User.Roles.MERCHANT) & Q(merchant__bank__id=pk))
        active_bank_users = bank_employees | merchants

        data = {
            "new_claims": new_claims,
            "attend_to_claims": attend_to_claims,
            "pre_mediation_claims": annotate_by_status_stage['pre_mediation'],
            "mediation_claims": annotate_by_status_stage["mediation"],
            "chargeback_claims": annotate_by_status_stage["chargeback"],
            "chargeback_escalation_claims": annotate_by_status_stage["chargeback_escalation"],
            "dispute_claims": annotate_by_status_stage["dispute"],
            "dispute_response_claims": annotate_by_status_stage["dispute_response"],
            "pre_arbitration_claims": annotate_by_status_stage["pre_arbitration"],
            "pre_arbitration_response_claims": annotate_by_status_stage["pre_arbitration_response"],
            "arbitration_claims": annotate_by_status_stage["arbitration"],
            "final_ruling_claims": annotate_by_status_stage["final_ruling"],
            "closed_claims": annotate_by_status_stage["closed"],
            "fraud_claims": annotate_by_rc_group["fraud"],
            "authorization_claims": annotate_by_rc_group["authorization"],
            "point_of_interaction_error_claims": annotate_by_rc_group["point_of_interaction_error"],
            "cardholder_disputes_claims": annotate_by_rc_group["cardholder_disputes"],
            "active_bank_users": active_bank_users.count(),
        }
        return Response(data)


class BankUpdatedClaimsStatistics(APIView):
    permission_classes = (IsAuthenticated, AllowChargebackOfficerPermission | AllowCopManagerPermission |
                          AllowTopLevelPermission)

    def get(self, request, *args, **kwargs):
        pk = kwargs['pk']
        start_date = request.query_params.get('start-date', None)
        end_date = request.query_params.get('end-date', None)
        qs = Claim.objects.filter(bank__id=pk)

        if start_date:
            qs = qs.filter(create_date__gte=start_date)
        if end_date:
            qs = qs.filter(create_date__lte=end_date)
        qs = qs.count()

        data = {
            "updated_claims": qs
        }

        return Response(data)


class ClaimsStatistics(APIView):
    permission_classes = (IsAuthenticated, AllowChargebackOfficerPermission | AllowCopManagerPermission |
                          AllowTopLevelPermission)

    def get(self, request):
        qs = Claim.objects.all()
        new_claims = qs.filter(chargeback_officer=None).count()
        attend_to_claims = qs.filter(create_date__lte=timezone.now() - datetime.timedelta(days=90)).count()

        data = {
            "new_claims": new_claims,
            "attend_to_claims": attend_to_claims,
        }
        return Response(data)


class UpdatedClaimsStatistics(APIView):
    permission_classes = (IsAuthenticated, AllowChargebackOfficerPermission | AllowCopManagerPermission |
                          AllowTopLevelPermission)

    def get(self, request, *args, **kwargs):
        start_date = request.query_params.get('start-date', None)
        end_date = request.query_params.get('end-date', None)
        qs = Claim.objects.filter()

        if start_date:
            qs = qs.filter(create_date__gte=start_date)
        if end_date:
            qs = qs.filter(create_date__lte=end_date)
        qs = qs.count()

        data = {
            "updated_claims": qs
        }

        return Response(data)


class ClaimsStatisticsByStatusStage(APIView):
    permission_classes = (IsAuthenticated, AllowChargebackOfficerPermission | AllowCopManagerPermission |
                          AllowTopLevelPermission)

    def get(self, request):
        start_date = request.query_params.get('start-date', None)
        end_date = request.query_params.get('end-date', None)
        qs = Claim.objects.filter()

        if start_date:
            qs = qs.filter(create_date__gte=start_date)
        if end_date:
            qs = qs.filter(create_date__lte=end_date)

        annotate_by_status_stage = qs.aggregate(
            pre_mediation=Count('status', filter=Q(status__stage=Status.Stages.PRE_MEDIATION)),
            mediation=Count('status', filter=Q(status__stage=Status.Stages.MEDIATION)),
            chargeback=Count('status', filter=Q(status__stage=Status.Stages.CHARGEBACK)),
            chargeback_escalation=Count('status', filter=Q(status__stage=Status.Stages.CHARGEBACK_ESCALATION)),
            dispute=Count('status', filter=Q(status__stage=Status.Stages.DISPUTE)),
            dispute_response=Count('status', filter=Q(status__stage=Status.Stages.DISPUTE_RESPONSE)),
            pre_arbitration=Count('status', filter=Q(status__stage=Status.Stages.PRE_ARBITRATION)),
            pre_arbitration_response=Count('status', filter=Q(status__stage=Status.Stages.PRE_ARBITRATION_RESPONSE)),
            arbitration=Count('status', filter=Q(status__stage=Status.Stages.ARBITRATION)),
            final_ruling=Count('status', filter=Q(status__stage=Status.Stages.FINAL_RULING)),
            closed=Count('status', filter=Q(status__stage=Status.Stages.CLOSED)),
        )


        data = {
            "pre_mediation_claims": annotate_by_status_stage['pre_mediation'],
            "mediation_claims": annotate_by_status_stage["mediation"],
            "chargeback_claims": annotate_by_status_stage["chargeback"],
            "chargeback_escalation_claims": annotate_by_status_stage["chargeback_escalation"],
            "closed_claims": annotate_by_status_stage["closed"],
        }

        return Response(data)


class ClaimsStatisticsByRcGroup(APIView):
    permission_classes = (IsAuthenticated, AllowChargebackOfficerPermission | AllowCopManagerPermission |
                          AllowTopLevelPermission)

    def get(self, request):
        start_date = request.query_params.get('start-date', None)
        end_date = request.query_params.get('end-date', None)
        qs = Claim.objects.filter()

        if start_date:
            qs = qs.filter(create_date__gte=start_date)
        if end_date:
            qs = qs.filter(create_date__lte=end_date)

        annotate_by_rc_group = qs.aggregate(
            fraud=Count('claim_reason_code', filter=(
                Q(claim_reason_code__group_visa=ReasonCodeGroup.Group.FRAUD) | Q(
                claim_reason_code__group_mastercard=ReasonCodeGroup.Group.FRAUD)
            )),
            authorization=Count('claim_reason_code', filter=(
                Q(claim_reason_code__group_visa=ReasonCodeGroup.Group.AUTHORIZATION) | Q(
                claim_reason_code__group_mastercard=ReasonCodeGroup.Group.AUTHORIZATION)
            )),
            point_of_interaction_error=Count('claim_reason_code', filter=(
                Q(claim_reason_code__group_visa=ReasonCodeGroup.Group.POINT_OF_INTERACTION_ERROR) | Q(
                claim_reason_code__group_mastercard=ReasonCodeGroup.Group.POINT_OF_INTERACTION_ERROR)
            )),
            cardholder_disputes=Count('claim_reason_code', filter=(
                Q(claim_reason_code__group_visa=ReasonCodeGroup.Group.CARDHOLDER_DISPUTES) | Q(
                claim_reason_code__group_mastercard=ReasonCodeGroup.Group.CARDHOLDER_DISPUTES)
            )),
        )

        data = {
            "fraud_claims": annotate_by_rc_group["fraud"],
            "authorization_claims": annotate_by_rc_group["authorization"],
            "point_of_interaction_error_claims": annotate_by_rc_group["point_of_interaction_error"],
            "cardholder_disputes_claims": annotate_by_rc_group["cardholder_disputes"],
        }
        return Response(data)


class ClaimsStatisticsBySupportChoices(APIView):
    permission_classes = (IsAuthenticated, AllowChargebackOfficerPermission | AllowCopManagerPermission |
                          AllowTopLevelPermission)

    def get(self, request):
        start_date = request.query_params.get('start-date', None)
        end_date = request.query_params.get('end-date', None)
        qs = Claim.objects.filter()

        if start_date:
            qs = qs.filter(create_date__gte=start_date)
        if end_date:
            qs = qs.filter(create_date__lte=end_date)

        annotate_by_support = qs.aggregate(
            them_on_us=Count('support', filter=Q(support=Claim.Support.THEM_ON_US)),
            us_on_them=Count('support', filter=Q(support=Claim.Support.US_ON_THEM)),
            us_on_us=Count('support', filter=Q(support=Claim.Support.US_ON_US)),
        )

        data = {
            "them_on_us": annotate_by_support["them_on_us"],
            "us_on_them": annotate_by_support["us_on_them"],
            "us_on_us": annotate_by_support["us_on_us"],
        }
        return Response(data)


class InvoiceClaimsStatistics(APIView):
    permission_classes = (IsAuthenticated, AllowChargebackOfficerPermission | AllowCopManagerPermission |
                          AllowTopLevelPermission)

    def get(self, request):
        start_date = request.query_params.get('start-date', None)
        end_date = request.query_params.get('end-date', None)

        user_is_authenticated = request.user.is_authenticated
        user = request.user
        request_user = user.email

        bank_employee = BankEmployee.objects.select_related('bank').get(user=user)
        payer = bank_employee.bank
        payer_name_eng = payer.name_eng
        license_type = payer.license.type_license
        # We can add more parameters (license) to the response! If we need.

        # The amount of all claims of the bank for the period
        # TODO: period year month
        pk = payer.id
        qs = Claim.objects.filter(bank__id=pk)

        if start_date:
            qs = qs.filter(create_date__gte=start_date)
        if end_date:
            qs = qs.filter(create_date__lte=end_date)
        number_all_claims = qs.count()

        # Stats by-rc-group
        annotate_by_rc_group = qs.aggregate(
            fraud=Count('claim_reason_code', filter=(
                Q(claim_reason_code__group_visa=ReasonCodeGroup.Group.FRAUD) | Q(
                claim_reason_code__group_mastercard=ReasonCodeGroup.Group.FRAUD)
            )),
            authorization=Count('claim_reason_code', filter=(
                Q(claim_reason_code__group_visa=ReasonCodeGroup.Group.AUTHORIZATION) | Q(
                claim_reason_code__group_mastercard=ReasonCodeGroup.Group.AUTHORIZATION)
            )),
            point_of_interaction_error=Count('claim_reason_code', filter=(
                Q(claim_reason_code__group_visa=ReasonCodeGroup.Group.POINT_OF_INTERACTION_ERROR) | Q(
                claim_reason_code__group_mastercard=ReasonCodeGroup.Group.POINT_OF_INTERACTION_ERROR)
            )),
            cardholder_disputes=Count('claim_reason_code', filter=(
                Q(claim_reason_code__group_visa=ReasonCodeGroup.Group.CARDHOLDER_DISPUTES) | Q(
                claim_reason_code__group_mastercard=ReasonCodeGroup.Group.CARDHOLDER_DISPUTES)
            )),
        )

        stats_by_rc_group = {
            "fraud_claims": annotate_by_rc_group["fraud"],
            "authorization_claims": annotate_by_rc_group["authorization"],
            "point_of_interaction_error_claims": annotate_by_rc_group["point_of_interaction_error"],
            "cardholder_disputes_claims": annotate_by_rc_group["cardholder_disputes"],
        }

        # Cost of licenses and implementations
        # You need to know the number of hours of implementation and how many times it should be displayed ???
        license_cost = payer.license.license_cost
        hours_implemented = 2
        implemented_cost = payer.license.implemented_cost * hours_implemented

        # User fees
        ee = BankEmployee.objects.select_related('bank__role').filter(bank=pk)
        bank_employees = BankEmployee.objects.select_related('bank').filter(bank=pk).count()
        base_employees_fee = payer.license.per_user_fee * bank_employees

        officers = BankEmployee.objects.all().filter(bank=pk) \
            .select_related("bank", "user").filter(user__role='chargeback_officer').count()
        if officers <= payer.license.officers_before_cost_up:
            officers_fee = payer.license.per_officer_fee * officers
        else:
            officers_fee = payer.license.per_officer_up_fee * officers

        invoice_date = timezone.now().date()

        # TODO: Invoice number ?

        data = {
            "invoice_number": 1,
            "invoice_date": invoice_date,
            "period": {
                "start_date": start_date,
                "end_date": end_date,
            },
            "user_is_authenticated": user_is_authenticated,
            "request_user": request_user,
            "payer_name_eng": payer_name_eng,
            "license_type": license_type,
            "number_all_claims": number_all_claims,
            "stats_by_rc_group": stats_by_rc_group,
            "implemented_cost": implemented_cost,
            "bank_employees": bank_employees,
            "base_employees_fee": base_employees_fee,
            "license_cost": license_cost,
            "officers": officers,
            "officers_fee": officers_fee

        }
        return Response(data)
