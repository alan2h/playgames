
from django import forms

from .models import Cliente, Contacto, Cuota


class ClienteForm(forms.ModelForm):

    codigo_barras = forms.CharField(max_length=3000, required=False,
                                    widget=(forms.TextInput(attrs=(
                                        {
                                            'class': 'form-control'
                                        }
                                    ))))

    email = forms.EmailField(max_length=3000, required=True,
                            widget=(forms.TextInput(attrs=(
                                {
                                    'class': 'form-control',
                                    'type': 'email'
                                }
                            ))))

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
    direccion = forms.CharField(max_length=800, required=False,
                                widget=forms.Textarea(attrs=(
                                    {
                                        'class': 'form-control'
                                    }
                                )))

    puntos = forms.IntegerField(required=False,
                               widget=forms.NumberInput(attrs=(
                                   {
                                        'class': 'form-control'
                                   }
                               )))
    credito = forms.DecimalField(required=False,
                                 widget=forms.NumberInput(attrs=(
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
        fields = ['codigo_barras', 'nombre', 'apellido', 'email', 'direccion',
                  'fecha_nacimiento', 'numero_documento', 'puntos', 'credito']
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


class CuotaForm(forms.ModelForm):

    choices = (
        ('Enero', 'Enero'),
        ('Febrero', 'Febrero'),
        ('Marzo', 'Marzo'),
        ('Abril', 'Abril'),
        ('Mayo', 'Mayo'),
        ('Junio', 'Junio'),
        ('Julio', 'Julio'),
        ('Agosto', 'Agosto'),
        ('Septiembre', 'Septiembre'),
        ('Octubre', 'Octubre'),
        ('Noviembre', 'Noviembre'),
        ('Diciembre', 'Diciembre')
    )

    cliente = forms.ModelChoiceField(queryset=Cliente.objects.all(),
                                     required=True)

    precio = forms.DecimalField(max_digits=12, decimal_places=2,
                                required=True, widget=forms.NumberInput(attrs={
                                    'class': 'form-control'
                                }))
    mes = forms.ChoiceField(choices=choices, required=True,
                          widget=forms.Select(attrs={
                              'class': 'form-control'
                          }))

    class Meta:
        fields = ['precio', 'mes', 'cliente']
        model = Cuota
