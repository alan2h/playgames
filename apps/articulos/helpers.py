from copy import deepcopy

from reportlab.lib.units import mm

from django.http import JsonResponse, HttpResponse
from django.core import serializers

# Código de Barras
from reportlab.graphics.barcode import createBarcodeDrawing
from reportlab.graphics.shapes import Drawing


from .forms import MarcaForm, RubroForm, CategoriaForm
from .models import Articulo, Categoria, Rubro

from apps.sucursales.models import Sucursal


''' --------------------------------- '''
''' Ajax para consulta de subcategorias '''
''' --------------------------------- '''
def ajax_query_rubro(request):

    if request.is_ajax():
        if request.POST.get('categoria__id') != '':
            rubro = Rubro.objects.filter(categoria__id=request.POST.get('categoria__id'))
            if rubro.exists():
                qs_json = serializers.serialize('json', rubro)
                return HttpResponse(qs_json, content_type='application/json')
            rubro = []
            qs_json = serializers.serialize('json', rubro)
            return HttpResponse(qs_json, content_type='application/json')
        else:
            rubro = []
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


def buscar_codigo(qs, codigo, sucursal=None):
    qs = Articulo.objects.filter(
        baja=False,
        codigo_barra__icontains=codigo,
        sucursal=sucursal
    )
    return qs


def buscar_descripcion(qs, descripcion, sucursal=None):
    if (sucursal):
        if qs.exists() is False:
            qs = Articulo.objects.filter(
                baja=False,
                descripcion__icontains=
                descripcion,
                sucursal=sucursal
            )
    else:
        if qs.exists() is False:
            qs = Articulo.objects.filter(
                baja=False,
                descripcion__icontains=
                descripcion
            )
    return qs

def buscar_nombre(qs, nombre, sucursal=None):
    if (sucursal):
        if qs.exists() is False:
            qs = Articulo.objects.filter(
                baja=False,
                nombre__icontains=
                nombre,
                sucursal=sucursal
            )
    else:
        if qs.exists() is False:
            qs = Articulo.objects.filter(
                baja=False,
                nombre__icontains=
                nombre
            )
    return qs


def buscar_precio_venta(qs, precio_venta, sucursal=None):
    if (sucursal):
        if qs.exists() is False:
            if '.' in precio_venta:
                if precio_venta.split('.')[0].isnumeric() and \
                        precio_venta.split('.')[1].isnumeric():
                    qs = Articulo.objects.filter(
                        baja=False,
                        precio_venta=precio_venta,
                        sucursal=sucursal
                    )
            elif ',' in precio_venta:
                if precio_venta.split(',')[0].isnumeric() and \
                        precio_venta.split(',')[1].isnumeric():
                    precio_formateado = precio_venta.replace(',', '.')
                    qs = Articulo.objects.filter(
                        baja=False,
                        precio_venta=precio_formateado,
                        sucursal=sucursal
                    )
            elif precio_venta.isnumeric():
                qs = Articulo.objects.filter(
                    baja=False,
                    precio_venta=precio_venta,
                    sucursal=sucursal
                )
    else:

        if qs.exists() is False:
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


def buscar_precio_compra(qs, precio_compra, sucursal=None):
    if (sucursal):
        if qs.exists() is False:
            if '.' in precio_compra:
                if precio_compra.split('.')[0].isnumeric() and \
                        precio_compra.split('.')[1].isnumeric():
                    qs = Articulo.objects.filter(
                        baja=False,
                        precio_compra=precio_compra,
                        sucursal=sucursal
                    )
            elif ',' in precio_compra:
                if precio_compra.split(',')[0].isnumeric() and \
                        precio_compra.split(',')[1].isnumeric():
                    precio_formateado = precio_compra.replace(',', '.')
                    qs = Articulo.objects.filter(
                        baja=False,
                        precio_compra=precio_formateado,
                        sucursal=sucursal
                    )
            elif precio_compra.isnumeric():
                qs = Articulo.objects.filter(
                    baja=False,
                    precio_compra=precio_compra,
                    sucursal=sucursal
                )
    else:
        if qs.exists() is False:
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


def buscar_stock(qs, stock, sucursal=None):
    if (sucursal):
        if qs.exists() is False:
            if stock.isnumeric():
                qs = Articulo.objects.filter(
                    baja=False,
                    stock=stock,
                    sucursal=sucursal
                )
    else:
        if qs.exists() is False:
            if stock.isnumeric():
                qs = Articulo.objects.filter(
                    baja=False,
                    stock=stock
                )
    return qs


def buscar_stock_minimo(qs, stock_minimo, sucursal=None):
    if (sucursal):
         if qs.exists() is False:
            if stock_minimo.isnumeric():
                qs = Articulo.objects.filter(
                    baja=False,
                    stock_minimo=stock_minimo,
                    sucursal=sucursal
                )
    else:
        if qs.exists() is False:
            if stock_minimo.isnumeric():
                qs = Articulo.objects.filter(
                    baja=False,
                    stock_minimo=stock_minimo
                )
    return qs


def buscar_fecha_compra(qs, fecha_compra, sucursal=None):

    if qs.exists() is False:
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


def buscar_marca(qs, marca, sucursal=None):
    if (sucursal):
        qs = Articulo.objects.filter(
            baja=False,
            marca__descripcion__icontains=marca,
            sucursal=sucursal
            )
    else:
        qs = Articulo.objects.filter(
            baja=False,
            marca__descripcion__icontains=marca
            )
    return qs


def buscar_rubro(qs, rubro, sucursal=None):
    if (sucursal):
        qs = Articulo.objects.filter(
            baja=False,
            rubro__descripcion__icontains=rubro,
            sucursal=sucursal
        )
    else:
        qs = Articulo.objects.filter(
            baja=False,
            rubro__descripcion__icontains=rubro
        )
    return qs


def buscar_categoria(qs, categoria, sucursal=None):
    if (sucursal):
        qs = Articulo.objects.filter(
            baja=False,
            rubro__categoria__descripcion__icontains=categoria,
            sucursal=sucursal
        )
    else:
        qs = Articulo.objects.filter(
            baja=False,
            rubro__categoria__descripcion__icontains=categoria
        )
    return qs


# en caso de tener categoria como busqueda

def buscar_marca_categoria(qs, marca, categoria, sucursal=None):
    if (sucursal):
        qs = Articulo.objects.filter(
            baja=False,
            marca__descripcion__icontains=marca,
            rubro__categoria__id=int(categoria),
            sucursal=sucursal
            )
    else:
        qs = Articulo.objects.filter(
            baja=False,
            marca__descripcion__icontains=marca,
            rubro__categoria__id=int(categoria)
            )
    return qs


def buscar_rubro_categoria(qs, rubro, categoria, sucursal=None):
    if (sucursal):
        qs = Articulo.objects.filter(
            baja=False,
            rubro__descripcion__icontains=rubro,
            rubro__categoria__id=int(categoria),
            sucursal=sucursal
        )
    else:
        qs = Articulo.objects.filter(
            baja=False,
            rubro__descripcion__icontains=rubro,
            rubro__categoria__id=int(categoria)
        )
    return qs


def buscar_nombre_categoria(qs, nombre, categoria, sucursal=None):
    if (sucursal):
        qs = Articulo.objects.filter(
            baja=False,
            nombre__icontains=nombre,
            rubro__categoria__id=int(categoria),
            sucursal=sucursal
            )
    else:
        qs = Articulo.objects.filter(
            baja=False,
            nombre__icontains=nombre,
            rubro__categoria__id=int(categoria)
            )
    return qs


def buscar_descripcion_categoria(qs, descripcion, categoria, sucursal=None):
    if (sucursal):
        qs = Articulo.objects.filter(
            baja=False,
            descripcion__icontains=descripcion,
            rubro__categoria__id=int(categoria),
            sucursal = sucursal
        )
    else:
        qs = Articulo.objects.filter(
            baja=False,
            descripcion__icontains=descripcion,
            rubro__categoria__id=int(categoria)
        )
    return qs


''' ---------------------------------- '''
''' Ajax para cambiar la sucursal de un articulo '''
''' ---------------------------------- '''

def ajax_cambiar_sucursal(request):

    if request.is_ajax():
        
        articulo = Articulo.objects.get(pk=request.POST.get('id_articulo'))
        sucursal = Sucursal.objects.get(pk=request.POST.get('id_nombre_sucursal'))

        articulo_copia = deepcopy(articulo)
        articulo_copia.id = None
        articulo_copia.stock = int(request.POST.get('id_cantidad_articulo'))
        articulo_copia.sucursal = sucursal
        articulo_copia.save()

        articulo.stock = int(articulo.stock) - int(request.POST.get('id_cantidad_articulo'))
        articulo.save()
    
        data = {
            'message': 'Se guardo correctamente'
        }
        return JsonResponse(data)