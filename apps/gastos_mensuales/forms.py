
import datetime

from django import forms

from .models import GastoMensual


class GastoMensualForm(forms.ModelForm):
    
    fecha = forms.DateField(initial=datetime.datetime.now(),
                            required=True, widget=forms.DateInput(attrs=(
            {
                'class': 'form-control'
            }
        )))
    motivo = forms.CharField(required=True, max_length=3000, 
                             widget=forms.TextInput(attrs=({'class': 'form-control'})))
    monto = forms.DecimalField(required=True, max_digits=12, decimal_places=2,
                               widget=forms.NumberInput(attrs=({'class': 'form-control'})))

    class Meta:
        fields = '__all__'
        model = GastoMensual
