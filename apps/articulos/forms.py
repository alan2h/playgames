
from django import forms

from .models import Articulo, Marca, Rubro, Categoria
from apps.sucursales.models import Sucursal


class ArticuloForm(forms.ModelForm):

    codigo_barra = forms.CharField(max_length=600, required=False,
                                   widget=forms.TextInput(attrs=(
                                       {'class': 'form-control'}
                                   )))
    nombre = forms.CharField(max_length=1000, required=True, widget=forms.TextInput(
        attrs=({'class': 'form-control'}
        )))
    descripcion = forms.CharField(max_length=1000, required=False,
                                  widget=forms.TextInput(attrs=(
                                      {'class': 'form-control'}
                                  )))
    marca = forms.ModelChoiceField(required=False,
                                   queryset=Marca.objects.all(),
                                   widget=forms.Select(attrs=(
                                       {'class': 'form-control'}
                                   )))
    rubro = forms.ModelChoiceField(required=True,
                                   queryset=Rubro.objects.all(),
                                   widget=forms.Select(attrs=(
                                       {'class': 'form-control'}
                                   )))
    precio_venta = forms.DecimalField(required=True, decimal_places=2,
                                      max_digits=12,
                                      widget=forms.NumberInput(attrs=(
                                           {'class': 'form-control'}
                                      )))
    precio_debito = forms.DecimalField(required=False, decimal_places=2,
                                         max_digits=12,
                                         widget=forms.NumberInput(attrs=(
                                            {'class': 'form-control'}
                                         )))
    precio_credito = forms.DecimalField(required=False, decimal_places=2,
                                        max_digits=12,
                                        widget=forms.NumberInput(attrs=(
                                            {
                                                'class': 'form-control'
                                            }
                                        )))
    precio_web = forms.DecimalField(required=False, decimal_places=2,
                                        max_digits=12,
                                        widget=forms.NumberInput(attrs=(
                                            {
                                                'class': 'form-control'
                                            }
                                        )))
    precio_compra = forms.DecimalField(required=True, decimal_places=2,
                                       max_digits=12,
                                       widget=forms.NumberInput(attrs=(
                                           {'class': 'form-control'}
                                       )))
    stock = forms.IntegerField(initial=1, required=True,
                               widget=forms.NumberInput(attrs=(
                                   {'class': 'form-control'}
                               )))
    stock_minimo = forms.IntegerField(initial=0, required=True,
                                      widget=forms.NumberInput(attrs=(
                                          {'class': 'form-control'}
                                      )))
    imagen = forms.ImageField(required=False, widget=forms.FileInput(attrs=(
        {
            'class': 'form-control'
         }
    )))
    impuesto_interno = forms.IntegerField(initial=0, required=False,
                                          widget=forms.NumberInput(attrs=(
                                              {'class': 'form-control'}
                                          )))
    alicuota_iva = forms.IntegerField(initial=21, required=False,
                                      widget=forms.NumberInput(attrs=(
                                          {'class': 'form-control'}
                                      )))
    fecha_compra = forms.DateField(required=True,
                                   widget=forms.DateInput(attrs=(
                                       {'class': 'form-control'}
                                   )))

    sucursal = forms.ModelChoiceField(queryset=Sucursal.objects.all(), required=True,
    widget=forms.Select(
        {'class': 'form-control'}))

    no_suma_caja = forms.BooleanField(initial=False, required=False, widget=forms.CheckboxInput(attrs=(
                                        {
                                            'class': 'form-control'
                                        }
                                    )))

    class Meta:
        fields = [
            'codigo_barra', 'descripcion', 'precio_compra', 'precio_venta',
            'precio_credito', 'precio_debito', 'stock', 'stock_minimo',
            'rubro', 'marca', 'impuesto_interno', 'alicuota_iva', 'fecha_compra',
            'imagen', 'nombre', 'sucursal', 'no_suma_caja', 'precio_web'
        ]

        model = Articulo


class MarcaForm(forms.ModelForm):

    descripcion = forms.CharField(required=True, max_length=600,
                                  widget=forms.TextInput(attrs=(
                                      {
                                          'class': 'form-control',
                                          'id': 'id_descripcion_marca'
                                      }
                                  )))

    class Meta:
        fields = ['descripcion']
        model = Marca


class CategoriaForm(forms.ModelForm):

    descripcion = forms.CharField(max_length=600, required=True, widget=forms.TextInput(attrs=({
        'class': 'form-control',
        'id': 'id_descripcion_categoria'
    })))

    class Meta:
        fields = ['descripcion']
        model = Categoria


class RubroForm(forms.ModelForm):

    categoria = forms.ModelChoiceField(queryset=Categoria.objects.all(),
     required=True, widget=forms.Select(attrs=({'class': 'form-control'})))

    descripcion = forms.CharField(required=True, max_length=600,
                                  widget=forms.TextInput(attrs=(
                                      {
                                          'class': 'form-control',
                                          'id': 'id_descripcion_rubro'
                                      }
                                  )))

    class Meta:
        fields = ['categoria', 'descripcion']
        model = Rubro


class ArticuloDeleteForm(forms.ModelForm):

    causa_baja = forms.CharField(max_length=600, required=True,
                                 initial='Sin especificar',
                                 widget=forms.Textarea(attrs=(
                                     {
                                         'class': 'form-control'
                                     }
                                 )))

    class Meta:
        fields = ['causa_baja']
        model = Articulo


class ActualizacionPrecioForm(forms.ModelForm):

    choices_variacion = (
        ('costo', 'precio_costo'),
        ('venta', 'precio_venta')
    )

    choices_moneda = (
        ('pesos', '$'),
        ('porcentaje', '%')
    )

    marca = forms.ModelChoiceField(queryset=Marca.objects.all(),
                                   required=False,
                                   widget=forms.Select(attrs=(
                                       {
                                           'class': 'form-control'
                                       }
                                   )))
    rubro = forms.ModelChoiceField(queryset=Rubro.objects.all(),
                                   required=False,
                                   widget=forms.Select(attrs=(
                                       {
                                            'class': 'form-control'
                                       }
                                   )))
    codigo_desde = forms.CharField(max_length=8000, required=False,
                                   widget=forms.TextInput(attrs=(
                                       {
                                           'class': 'form-control'
                                       }
                                   )))
    codigo_hasta = forms.CharField(max_length=8000, required=False,
                                   widget=forms.TextInput(attrs=(
                                       {
                                           'class': 'form-control'
                                       }
                                   )))

    variacion = forms.MultipleChoiceField(choices=choices_variacion,
                                          required=True,
                                          widget=forms.CheckboxSelectMultiple()
                                          )
    numero = forms.IntegerField(required=True,
                                widget=forms.NumberInput(attrs=(
                                    {
                                        'class': 'form-control'
                                    }
                                )))

    moneda = forms.MultipleChoiceField(choices=choices_moneda, required=True,
                                       widget=forms.CheckboxSelectMultiple(
                                           ))

    def clean_variacion(self):
        if len(self.cleaned_data['variacion']) >= 2:
            raise forms.ValidationError('Solo puede seleccionar 1 opción')
        return self.cleaned_data['variacion']

    def clean_moneda(self):
        if len(self.cleaned_data['moneda']) >= 2:
            raise forms.ValidationError('Solo puede seleccionar 1 opción')
        return self.cleaned_data['moneda']

    class Meta:
        fields = ['marca', 'rubro', 'codigo_desde',
                  'codigo_hasta', 'variacion',
                  'numero', 'moneda']
        model = Articulo
