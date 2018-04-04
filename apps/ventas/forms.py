
import datetime

from django import forms

from .models import Venta


class VentaForm(forms.ModelForm):

    fecha = forms.DateField(required=True, initial=datetime.datetime.now(),
                            widget=forms.DateInput(attrs=
                            {
                                'class': 'form-control col-md-7 col-xs-12'
                            }
                            ))

    class Meta:
        fields = '__all__'
        model = Venta
