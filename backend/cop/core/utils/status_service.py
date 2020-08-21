from cop.core.models import Status


class StatusService:
    statuses = Status.objects.all()
    claim = None
    current_status = None

    def __init__(self, claim, user):
        self.claim = claim
        self.user = user

