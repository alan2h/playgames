from reportlab.lib.units import mm

from django.http import JsonResponse, HttpResponse
from django.core import serializers

# Código de Barras
from reportlab.graphics.barcode import createBarcodeDrawing
from reportlab.graphics.shapes import Drawing


from .forms import MarcaForm, RubroForm, CategoriaForm
from .models import Articulo, Categoria, Rubro


''' --------------------------------- '''
''' Ajax para consulta de subcategorias '''
''' --------------------------------- '''
def ajax_query_rubro(request):

    if request.is_ajax():
        if request.POST.get('categoria__id') != '':
            rubro = Rubro.objects.filter(categoria__id=request.POST.get('categoria__id'))
        else:
            rubro = Rubro.objects.all()
        if rubro.exists():
            qs_json = serializers.serialize('json', rubro)
            return HttpResponse(qs_json, content_type='application/json')
        else:
            rubro = Rubro.objects.all()
            qs_json = serializers.serialize('json', rubro)
            return HttpResponse(qs_json, content_type='application/json')

''' ---------------------------------- '''
''' Ajax para creacion de complementos '''
''' ---------------------------------- '''

def ajax_create_marca(request):

    if request.is_ajax():
        marca_form = MarcaForm(data=request.POST)
        if marca_form.is_valid():
            marca = marca_form.save()
            data = {
                'is_valid': 'true',
                'id_marca': marca.pk,
                'id_descripcion': marca.descripcion
            }
        else:
            data = {
                'message': marca_form.errors
            }

        return JsonResponse(data)


def ajax_create_rubro(request):

    if request.is_ajax():
        rubro_form = RubroForm(data=request.POST)
        if rubro_form.is_valid():
            rubro = rubro_form.save()
            data = {
                'is_valid': 'true',
                'id_rubro': rubro.pk,
                'id_descripcion': rubro.descripcion
            }
        else:
            data = {
                'message': rubro_form.errors
            }

        return JsonResponse(data)


def ajax_create_categoria(request):
    
    if request.is_ajax():
        categoria_form = CategoriaForm(data=request.POST)
        if categoria_form.is_valid():
            categoria = categoria_form.save()
            data = {
                'is_valid': 'true',
                'id_categoria': categoria.id,
                'id_descripcion': categoria.descripcion
            }
        else:
            data = {
                'message': categoria_form.errors
            }

        return JsonResponse(data)

''' Ajax para creacion de complementos '''
''' ---------------------------------- '''


class DibujarBarcode(Drawing):

    def __init__(self, text_value, *args, **kw):

        barcode = createBarcodeDrawing('Code128', value=text_value,
                                       barHeight=10*mm, humanReadable=True)

        Drawing.__init__(self, barcode.width, barcode.height, *args, **kw)
        self.add(barcode, name='barcode')


def buscar_codigo(codigo):
    qs = Articulo.objects.filter(
        baja=False,
        codigo_barra=codigo
    )
    return qs


def buscar_descripcion(qs, descripcion):
    #if qs.exists() is False:
    qs = Articulo.objects.filter(
        baja=False,
        descripcion__icontains=
        descripcion
    )
    return qs

def buscar_nombre(qs, nombre):
    #if qs.exists() is False:
    qs = Articulo.objects.filter(
        baja=False,
        nombre__icontains=
        nombre
    )
    return qs


def buscar_precio_venta(qs, precio_venta):

    #if qs.exists() is False:
    if '.' in precio_venta:
        if precio_venta.split('.')[0].isnumeric() and \
                precio_venta.split('.')[1].isnumeric():
            qs = Articulo.objects.filter(
                baja=False,
                precio_venta=precio_venta
            )
    elif ',' in precio_venta:
        if precio_venta.split(',')[0].isnumeric() and \
                precio_venta.split(',')[1].isnumeric():
            precio_formateado = precio_venta.replace(',', '.')
            qs = Articulo.objects.filter(
                baja=False,
                precio_venta=precio_formateado
            )
    elif precio_venta.isnumeric():
        qs = Articulo.objects.filter(
            baja=False,
            precio_venta=precio_venta
        )
    return qs


def buscar_precio_compra(qs, precio_compra):

    #if qs.exists() is False:
    if '.' in precio_compra:
        if precio_compra.split('.')[0].isnumeric() and \
                precio_compra.split('.')[1].isnumeric():
            qs = Articulo.objects.filter(
                baja=False,
                precio_compra=precio_compra
            )
    elif ',' in precio_compra:
        if precio_compra.split(',')[0].isnumeric() and \
                precio_compra.split(',')[1].isnumeric():
            precio_formateado = precio_compra.replace(',', '.')
            qs = Articulo.objects.filter(
                baja=False,
                precio_compra=precio_formateado
            )
    elif precio_compra.isnumeric():
        qs = Articulo.objects.filter(
            baja=False,
            precio_compra=precio_compra
        )
    return qs


def buscar_stock(qs, stock):

    #if qs.exists() is False:
    if stock.isnumeric():
        qs = Articulo.objects.filter(
            baja=False,
            stock=stock
        )
    return qs


def buscar_stock_minimo(qs, stock_minimo):

    #if qs.exists() is False:
    if stock_minimo.isnumeric():
        qs = Articulo.objects.filter(
            baja=False,
            stock_minimo=stock_minimo
        )
    return qs


def buscar_fecha_compra(qs, fecha_compra):

    #if qs.exists() is False:
    if len(fecha_compra.split('/')) is 3:
        if '/' in fecha_compra:
            if (fecha_compra.split('/')[0].isnumeric() and
                fecha_compra.split('/')[1].isnumeric() and
                    fecha_compra.split('/')[2].isnumeric()):

                qs = Articulo.objects.filter(baja=False,
                                                fecha_compra=
                                                fecha_compra.split('/')[2] + "-" +
                                                fecha_compra.split('/')[1] + "-" +
                                                fecha_compra.split('/')[0])

    return qs


def buscar_marca(qs, marca):
    
    qs = Articulo.objects.filter(
        marca__descripcion__icontains=marca
        )
    return qs


def buscar_rubro(qs, rubro):

    qs = Articulo.objects.filter(
        rubro__descripcion__icontains=rubro
    )
    return qs