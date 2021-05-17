from rest_framework import serializers

from cop.core.models import Bank, BankBin


class BankBinSerializer(serializers.ModelSerializer):

    class Meta:
        model = BankBin
        fields = ("bin", "product_code", "bank")


class BankSerializer(serializers.ModelSerializer):
    bins = BankBinSerializer(many=True)

    class Meta:
        model = Bank
        fields = (
            'id',
            'bins',
            'type',
            'name_eng',
            'name_uk',
            'name_rus',
            'operator_name',
            'contact_person',
            'contact_telephone',
            'contact_email',
        )

    def create(self, validated_data):
        bins = validated_data.pop('bins')
        instance = Bank.objects.create(**validated_data)
        for bin in bins:
            BankBin.objects.create(**dict(bin), bank=instance)
        return instance

    def update(self, instance, validated_data):
        bins = validated_data.pop('bins')
        instance = super().update(instance, validated_data)
        instance.bins.all().delete()
        for bin in bins:
            BankBin.objects.create(**dict(bin), bank=instance)
        return instance
