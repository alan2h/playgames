
import json
from django.http import JsonResponse

from apps.articulos.models import Articulo
from apps.ventas.models import ArticuloVenta, Venta

from apps.lib.cajas.gestion import CajaFunctions
from apps.lib.articulos.gestion_stock import ArticuloStock


def ajax_guardar_venta(request):
    articulo_venta_array = []
    forma_pago = request.POST.get('forma_pago')
    credito_porcentaje = request.POST.get('credito_porcentaje')
    porcentaje_descuento = request.POST.get('porcentaje_descuento')
    caja_funciones = CajaFunctions()
    articulo_stock = ArticuloStock()

    if request.is_ajax():
        if 'ventas' in request.POST:
            ventas = request.POST.get('ventas')
            the_dict = json.loads(ventas)
            for element in the_dict:
                articulo_vendidos = Articulo.objects.get(
                    pk=element['id'])

                precio_guardar = 0.0
                if forma_pago == 'efectivo':
                    precio_guardar = articulo_vendidos.precio_venta
                if forma_pago == 'debito':
                    precio_guardar = articulo_vendidos.precio_debito
                if forma_pago == 'credito':
                    precio_guardar = articulo_vendidos.precio_credito
                if forma_pago == 'descuento':
                    precio_guardar = articulo_vendidos.precio_venta    

                articulo_venta = ArticuloVenta(
                    articulo=articulo_vendidos,
                    cantidad=element['cantidad'],
                    precio_venta=precio_guardar)

                articulo_venta.save()
                # Resta en el stock el articulo vendido
                articulo_stock.restar_stock(articulo_venta.articulo.id,
                                            articulo_venta.cantidad)

                articulo_venta_array.append(articulo_venta)

            if forma_pago == 'descuento':
                con_descuento = (float(request.POST.get('precio_venta_total')) * float(porcentaje_descuento)) / 100
                resultado_descuento = float(request.POST.get('precio_venta_total')) - float(con_descuento)
                venta = Venta(
                    fecha=request.POST.get('fecha'),
                    precio_venta_total=resultado_descuento,
                    forma_pago=forma_pago,
                    porcentaje_aumento=credito_porcentaje,
                    porcentaje_descuento=porcentaje_descuento
                )
                venta.save()
            else:    
                venta = Venta(
                    fecha=request.POST.get('fecha'),
                    precio_venta_total=request.POST.get('precio_venta_total'),
                    forma_pago=forma_pago,
                    porcentaje_aumento=credito_porcentaje,
                    porcentaje_descuento=porcentaje_descuento
                )
                venta.save()

            # Guarda en la caja el precio total del efectivo

            if forma_pago == 'efectivo':
                caja_funciones.sumar_venta_efectivo(precio_efectivo=
                                                    request.POST.get(
                                                        'precio_venta_total'))
            if forma_pago == 'descuento':
                caja_funciones.sumar_venta_descuento(precio_efectivo=
                                                    request.POST.get(
                                                        'total_con_descuento'))
            if forma_pago == 'debito':
                caja_funciones.sumar_venta_debito(precio_debito=request.POST
                                                  .get('precio_venta_total'))
            if forma_pago == 'credito':
                aumento = (float(request.POST.get('precio_venta_total')) *
                           float(credito_porcentaje)) / 100
                precio_aumentado = \
                    float(request.POST.get('precio_venta_total')) + aumento
                caja_funciones.sumar_venta_credito(
                    precio_credito=precio_aumentado)

            for a in articulo_venta_array:
                venta.articulo_venta.add(a)
        data = {
            'success': 'La venta se registro con éxito',
            'id_venta': venta.pk
        }
        return JsonResponse(data)


def ajax_get_articulo_unico(request):

    if request.is_ajax():
        if 'codigo_articulo' in request.POST:
            codigo_articulo = request.POST.get('codigo_articulo')
            articulo = Articulo.objects.filter(codigo_barra=codigo_articulo,
                                               baja=False)

            if articulo.exists():

                if articulo[0].marca is not None:
                    marca = articulo[0].marca.descripcion
                else:
                    marca = ''

                if articulo[0].rubro is not None:
                    rubro = articulo[0].rubro.descripcion
                else:
                    rubro = ''

                data = {
                    'id': articulo[0].id,
                    'codigo_barra': articulo[0].codigo_barra,
                    'descripcion': articulo[0].descripcion,
                    'nombre': articulo[0].nombre,
                    'marca': marca,
                    'rubro': rubro,
                    'precio_venta': articulo[0].precio_venta,
                    'precio_compra': articulo[0].precio_compra,
                    'precio_debito': articulo[0].precio_debito,
                    'precio_credito': articulo[0].precio_credito,
                    'stock': articulo[0].stock,
                    'stock_minimo': articulo[0].stock_minimo,
                    'cantidad': '1'
                }

                return JsonResponse(data)
