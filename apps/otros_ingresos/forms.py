
import datetime

from django import forms

from .models import OtroIngreso


class OtroIngresoForm(forms.ModelForm):

    choices_motivos = (
        ('cuenta_corriente_cliente', 'Cuenta CTE cliente'),
        ('diferencia_caja', 'Diferencia con Caja'),
        ('varios', 'Varios')
    )

    fecha = forms.DateField(initial=datetime.datetime.now(),
                            required=True,
                            widget=forms.DateInput(attrs=(
                                {
                                    'class': 'form-control'
                                })))
    motivo = forms.ChoiceField(choices=choices_motivos, required=True,
                               widget=forms.Select(attrs=(
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
        model = OtroIngreso
