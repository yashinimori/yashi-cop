# django
from django import forms

# my
from bank.models import UserProfile


class SettingsForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ['category', 'position', 'organization', 'phone', 'email']
