
import datetime

from django import forms

from .models import Gasto

from apps.sucursales.models import Sucursal


class GastoForm(forms.ModelForm):

    fecha = forms.DateField(initial=datetime.datetime.now(),
                            required=True, widget=forms.DateInput(attrs=(
            {
                'class': 'form-control'
            }
        )))
    motivo = forms.CharField(required=True,
                             widget=forms.TextInput(attrs=(
                                   {
                                       'class': 'form-control'
                                   }
                             )))
    monto = forms.DecimalField(max_digits=12, decimal_places=2,
                               required=True, widget=forms.NumberInput(attrs=(
            {
                'class': 'form-control'
            }
        )))

    sucursal = forms.ModelChoiceField(required=False, queryset=Sucursal.objects.all())

    class Meta:
        fields = ['fecha', 'motivo', 'monto', 'sucursal']
        model = Gasto
