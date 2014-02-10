from django import forms
from albumi.models import Kayttaja
from django.contrib.auth.models import User


class UserForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput())

    class Meta:
        model = User
        fields = ('username', 'email', 'password')


class KayttajaForm(forms.ModelForm):
    class Meta:
        model = Kayttaja
        fields = ('osoite_katu',
                  'osoite_postinumero',
                  'osoite_postitoimipaikka',
                  'puhelinnumero')
