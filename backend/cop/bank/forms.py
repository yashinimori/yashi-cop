# django
from datetime import datetime

from django import forms

from cop.users.models import User


class SettingsForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'role', 'unit', 'phone', 'email']


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


class FinancialReportSearchForm(forms.Form):
    terminal_id = forms.CharField(label='Enter TerminalId', required=False)
    date = forms.DateField(label='Enter date', input_formats=['%Y-%m-%d'],
                                 widget=forms.DateInput(attrs={'placeholder': '2019-01-27'}))
