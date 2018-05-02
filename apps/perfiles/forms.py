from django import forms
from django.contrib.auth.models import User
from .models import Perfil
from apps.sucursales.models import Sucursal

from .models import Perfil


class PerfilForm(forms.ModelForm):

    usuario = forms.ModelChoiceField(required=True, queryset=User.objects.all(), widget=forms.Select(attrs=({'class': 'form-control'})))
    sucursal = forms.ModelChoiceField(required=True, queryset=Sucursal.objects.all(), widget=forms.Select(attrs=({'class': 'form-control'})))

    class Meta:
        fields = ['usuario', 'sucursal']
        model = Perfil