
from django import forms

from .models import Caja


class CajaForm(forms.ModelForm):

    caja_inicial = forms.DecimalField(initial="500",
                                      required=False, max_digits=12,
                                      decimal_places=2,
                                      widget=forms.NumberInput(attrs=(
                                          {
                                              'class': 'form-control'
                                          }
                                      )))
    caja_actual = forms.DecimalField(required=False, max_digits=12,
                                     decimal_places=2,
                                     widget=forms.NumberInput(attrs=(
                                         {
                                             'class': 'form-control',
                                             'readonly': 'readonly'
                                         }
                                     )))
    compras = forms.DecimalField(required=False, max_digits=12,
                                 decimal_places=2,
                                 widget=forms.NumberInput(attrs=(
                                     {
                                         'class': 'form-control',
                                         'readonly': 'readonly'
                                     }
                                 )))
    ventas_efectivo = forms.DecimalField(required=False, max_digits=12,
                                         decimal_places=2,
                                         widget=forms.NumberInput(attrs=(
                                             {
                                                 'class': 'form-control',
                                                 'readonly': 'readonly'
                                             }
                                         )))
    ventas_debito = forms.DecimalField(required=False, max_digits=12,
                                       decimal_places=2,
                                       widget=forms.NumberInput(attrs=(
                                           {
                                               'class': 'form-control',
                                               'readonly': 'readonly'
                                           }
                                       )))
    ventas_credito = forms.DecimalField(required=False, max_digits=12,
                                        decimal_places=2,
                                        widget=forms.NumberInput(attrs=(
                                            {
                                                'class': 'form-control',
                                                'readonly': 'readonly'
                                            }
                                        )))
    venta_sin_ganancia = forms.DecimalField(required=False, max_digits=12,
                                        decimal_places=2,
                                        widget=forms.NumberInput(attrs=(
                                            {
                                                'class': 'form-control',
                                                'readonly': 'readonly'
                                            }
                                        )))
    otros_ingresos = forms.DecimalField(required=False, max_digits=12,
                                 decimal_places=2,
                                 widget=forms.NumberInput(attrs=(
                                     {
                                         'class': 'form-control',
                                         'readonly': 'readonly'
                                     }
                                 )))
    otros_gastos = forms.DecimalField(required=False, max_digits=12,
                                      decimal_places=2,
                                      widget=forms.NumberInput(attrs=(
                                          {
                                              'class': 'form-control',
                                              'readonly': 'readonly'
                                          }
                                      )))

    class Meta:
        fields = ['caja_inicial', 'caja_actual', 'compras', 'ventas_efectivo',
                  'ventas_debito', 'ventas_credito', 'otros_ingresos', 'otros_gastos',
                  'venta_sin_ganancia']
        model = Caja
