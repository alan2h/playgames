
import datetime

from django import forms

from .models import Gasto


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

    class Meta:
        fields = ['fecha', 'motivo', 'monto']
        model = Gasto
