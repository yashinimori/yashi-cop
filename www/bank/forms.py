# django
from datetime import datetime

from django import forms

# my
from bank.models import UserProfile


class SettingsForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ['category', 'position', 'organization', 'phone', 'email']


class TransactionApiSearchForm(forms.Form):
    pan = forms.CharField()
    claim_id = forms.CharField(required=False, widget=forms.HiddenInput())
    arn = forms.CharField(required=False)
    start_date = forms.DateField(input_formats=['%Y-%m-%d'],
                                 widget=forms.DateInput(attrs={'placeholder': '2019-01-27'}))
    end_date = forms.DateField(input_formats=['%Y-%m-%d'],
                               widget=forms.DateInput(attrs={'placeholder': '2019-02-27'}))

    def clean(self):
        cleaned_data = super().clean()
        start_date = cleaned_data.get("start_date")
        end_date = cleaned_data.get("end_date")

        if start_date and end_date:
            if start_date > end_date:
                msg = "Start date should be earlier than end date."
                self.add_error('start_date', msg)
            if (end_date - start_date).days > 30:
                msg = "The search range is a maximum of 30 days."
                self.add_error('end_date', msg)
            if (datetime.now().date() - start_date).days > 730:
                msg = "Searches can be completed for up to 730 days of history."
                self.add_error('start_date', msg)
        return cleaned_data
