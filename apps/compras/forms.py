
import datetime

from django import forms

from .models import Compra


class CompraForm(forms.ModelForm):

    fecha = forms.DateField(required=True, initial=datetime.datetime.now(),
                            widget=forms.DateInput(attrs=
                            {
                                'class': 'form-control col-md-7 col-xs-12'
                            }
                            ))
    codigo_comprobante = forms.CharField(required=False,
                                         widget=forms.TextInput(attrs=(
                                            {
                                             'class': 'form-control  '
                                                      'col-md-7 col-xs-12'
                                         }
                                         )))

    class Meta:
        fields = '__all__'
        model = Compra
