
from django import forms

from .models import Cliente, Contacto


class ClienteForm(forms.ModelForm):

    nombre = forms.CharField(max_length=600, required=True,
                             widget=(forms.TextInput(attrs=(
                                 {
                                    'class': 'form-control'
                                 }
                             ))))
    apellido = forms.CharField(max_length=800, required=True,
                               widget=forms.TextInput(attrs=(
                                   {
                                        'class': 'form-control'
                                   }
                               )))
    direccion = forms.CharField(max_length=800, required=True,
                                widget=forms.Textarea(attrs=(
                                    {
                                        'class': 'form-control'
                                    }
                                )))

    fecha_nacimiento = forms.DateField(required=True,
                                   widget=forms.DateInput(attrs=(
                                       {'class': 'form-control'}
                                   )))
    numero_documento = forms.IntegerField(required=True, widget=forms.NumberInput(attrs=({'class': 'form-control'})))

    class Meta:
        fields = ['nombre', 'apellido', 'direccion', 'fecha_nacimiento', 'numero_documento']
        model = Cliente


class ContactoForm(forms.ModelForm):

    choices = (
        ('celular', 'celular'),
        ('email', 'email'),
        ('telefono_trabajo', 'Telefono del Trabajo'),
        ('telefono_casa', 'Telefono de la casa'),
        ('telefono1', 'Telefono 1'),
        ('telefono_casa2', 'Telefono 2')
    )

    cliente = forms.ModelChoiceField(queryset=Cliente.objects.all(),
                                     required=True,
                                     widget=forms.Select(attrs=(
                                           {
                                               'class': 'form-control'
                                           }
                                     )))

    tipo = forms.ChoiceField(choices=choices, required=True,
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
        fields = ['cliente', 'tipo', 'descripcion']
        model = Contacto
