
from django import forms

from .models import Contacto, Proveedor


class ProveedorForm(forms.ModelForm):

    nombre = forms.CharField(max_length=600, required=True,
                             widget=forms.TextInput(attrs=(
                                 {
                                     'class': 'form-control'
                                 }
                             )))
    direccion = forms.CharField(max_length=800, required=True,
                                widget=forms.TextInput(attrs=(
                                    {
                                        'class': 'form-control'
                                    }
                                )))

    class Meta:
        fields = ['nombre', 'direccion']
        model = Proveedor


class ContactoForm(forms.ModelForm):

    choices = (
        (' ', '-----'),
        ('celular', 'celular'),
        ('email', 'email'),
        ('telefono_trabajo', 'Telefono del Trabajo'),
        ('telefono_casa', 'Telefono de la casa'),
        ('telefono1', 'Telefono 1'),
        ('telefono_casa2', 'Telefono 2')
    )

    proveedor = forms.ModelChoiceField(queryset=Proveedor.objects.all(),
                                       required=True,
                                       widget=forms.Select(attrs=(
                                           {
                                               'class': 'form-control'
                                           }
                                       )))
    tipo = forms.ChoiceField(required=True, choices=choices,
                             widget=forms.Select(attrs=(
                                   {
                                       'class': 'form-control'
                                   }
                               )))

    descripcion = forms.CharField(max_length=600, required=True,
                                  widget=forms.TextInput(attrs=(
                                      {
                                          'class': 'form-control'
                                      }
                                  )))

    class Meta:
        fields = ['proveedor', 'tipo', 'descripcion']
        model = Contacto
