from rest_framework import serializers

from cop.core.models import Bank


class BankSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bank
        fields = (
            'id',
            'bin',
            'type',
            'name_eng',
            'name_uk',
            'name_rus',
            'operator_name',
            'contact_person',
            'contact_telephone',
            'contact_email',
        )
