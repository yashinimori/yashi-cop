from django.contrib.auth import get_user_model

from cop.core.models import Comment, ReasonCodeGroup, MEDIATION

User = get_user_model()


class ClaimReasonCodes:

    def document_request(instance, reason_code_group):
        comment = Comment.objects.create(
            user=instance.merchant.user,
            text=ReasonCodeGroup.objects.get(code=reason_code_group).description
        )
        instance.ch_comments.add(comment)

    def set_stage_to_mediation(instance, reason_code_group):
        instance.stage = MEDIATION

    CLAIM_REASON_CODES = {
        "0001": [document_request, set_stage_to_mediation],
        "0002": None,
        "0003": [document_request, set_stage_to_mediation],
        "0004": [document_request, set_stage_to_mediation],
        "0005": None,
        "0006": None,
        "0007": None,
        "0008": None,
        "0009": [document_request, set_stage_to_mediation],
        "0010": None,
        "0011": [document_request, set_stage_to_mediation],
        "0012": [document_request, set_stage_to_mediation],
        "0013": None,
        "0014": None,
        "0015": None,
        "0016": None,
        "0017": None,
        "0018": None,
        "0019": None,
        "0020": None,
        "0021": None,
        "0022": None,
        "0023": None,
        "0024": None,
        "0025": None,
        "0026": None,
        "0027": [document_request, set_stage_to_mediation],
        "0100": [document_request],
        "0101": None,
        "0500": [document_request, set_stage_to_mediation],
    }
