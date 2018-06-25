
import json
from django.http import JsonResponse

from apps.articulos.models import Articulo
from apps.ventas.models import ArticuloVenta, Venta

from apps.lib.cajas.gestion import CajaFunctions
from apps.lib.articulos.gestion_stock import ArticuloStock
from apps.lib.socios.gestion import SocioFunctions

from apps.socios_puntos.models import PuntoConfiguracion
from apps.clientes.models import Cliente
from apps.sucursales.models import Sucursal


def ajax_guardar_venta(request):
    articulo_venta_array = []
    forma_pago = request.POST.get('forma_pago')
    credito_porcentaje = request.POST.get('credito_porcentaje')
    porcentaje_descuento = request.POST.get('porcentaje_descuento')
    canje_socios = False

    caja_funciones = CajaFunctions()
    articulo_stock = ArticuloStock()
    socio_funciones = SocioFunctions()

    sucursal = Sucursal.objects.get(pk=request.session['id_sucursal'])

    if request.is_ajax():
        if 'ventas' in request.POST:
            ventas = request.POST.get('ventas')
            the_dict = json.loads(ventas)

            # -------- desarma el diccionario y procesa stock y demas resultados ----
            articulo_venta_array = split_component_venta(the_dict, forma_pago, request, articulo_stock) # esta variable se guardara en el modelo venta
            # -----------------------------------------------------------------------

            # la idea es registrar las ventas que no ingresan a caja para poder anularlas
            venta_sin_ganancia = (request.POST.get('no_sumar') == 'true')

            if forma_pago == 'descuento': # en caso de tener descuento lo calcula
                con_descuento = (float(request.POST.get('precio_venta_total')) * float(porcentaje_descuento)) / 100
                resultado_venta_total = float(request.POST.get('precio_venta_total')) - float(con_descuento)
            else:
                resultado_venta_total = request.POST.get('precio_venta_total')

            # si la forma de pago fue con canje de puntos de socios
            socio = None
            puntos = None
            canje_socios = (request.POST.get('canje_socios') == 'true')
            if canje_socios:
                forma_pago += '-Canje de Puntos'
                resultado_venta_total = request.POST.get('total_con_descuento')
                puntos = request.POST.get('puntos_socios')
                socio = socio_funciones.restar_puntos(request.POST.get('id_socio'), request.POST.get('puntos_socios'))

            # guarda la venta en un historial
            venta = Venta(
                fecha=request.POST.get('fecha'),
                precio_venta_total=resultado_venta_total,
                venta_sin_ganancia=venta_sin_ganancia,
                forma_pago=forma_pago,
                porcentaje_aumento=credito_porcentaje,
                socio=socio,
                puntos=puntos,
                porcentaje_descuento=porcentaje_descuento,
                sucursal=sucursal,
                usuario=str(request.user.get_username())
            )
            venta.save()

            if venta_sin_ganancia: # esta condicion verifica que se haya tildado que no sume a caja
                # en caso de que no sume a caja, ira a un campo especial que lo acumula
                caja_funciones.sumar_sin_ganancia(monto=request.POST.get('precio_venta_total'),
                                                  id_sucursal=request.session['id_sucursal'])
            else:
                # en caso de ser socio guarda el total en venta de socios
                # si la palabra canje de puntos se encuentra en la forma de pago
                if len(forma_pago.split('-')) > 1:
                    if forma_pago.split('-')[1] == 'Canje de Puntos':
                        caja_funciones.sumar_ventas_socios(monto=request.POST.get('total_con_descuento'),
                                                           id_sucursal=request.session['id_sucursal'])
                # Guarda en la caja el precio total del efectivo
                if forma_pago == 'efectivo':
                    caja_funciones.sumar_venta_efectivo(
                                                        precio_efectivo=request.POST.get('precio_venta_total'), id_sucursal=request.session['id_sucursal']
                                                        )
                if forma_pago == 'descuento':
                    caja_funciones.sumar_venta_descuento(
                                                         precio_efectivo=request.POST.get('total_con_descuento'), id_sucursal=request.session['id_sucursal']
                                                         )
                if forma_pago == 'debito':
                    caja_funciones.sumar_venta_debito(
                                                      precio_debito=request.POST.get('precio_venta_total'), id_sucursal=request.session['id_sucursal']
                                                      )
                if forma_pago == 'credito':
                    precio_aumentado = aumentar_precio_credito(
                                                               request.POST.get('precio_venta_total'),
                                                               credito_porcentaje
                                                               )
                    caja_funciones.sumar_venta_credito(
                                                       precio_credito=precio_aumentado, id_sucursal=request.session['id_sucursal']
                                                       )

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
                                               baja=False, stock__gte=1,
                                               sucursal__id=request.session.get('id_sucursal'))

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
                    'no_suma_caja': articulo[0].no_suma_caja,
                    'cantidad': '1'
                }
            else:
                data = {}
            return JsonResponse(data)


def sumar_puntos_socios(id, precio_guardar):
    ''' esta funcion se encarga de sumarle puntos a los socios '''
    if id:
        pesos_puntos = PuntoConfiguracion.objects.all()[0]
        cliente = Cliente.objects.get(pk=id)

        cantidad_puntos = (int(precio_guardar) / int(pesos_puntos.precio)) * int(pesos_puntos.punto)
        if (cliente.puntos):
            cliente.puntos = int(cliente.puntos) + int(cantidad_puntos)
        else:
            cliente.puntos = int(cantidad_puntos)
        return cliente.save()
    else:
        return 0


def guardar_articulo_venta(articulo_vendidos, element, precio_guardar):
    ''' guarda la relacion entre articulo y la venta '''
    articulo_venta = ArticuloVenta(
                                    articulo=articulo_vendidos,
                                    stock_anterior=articulo_vendidos.stock,
                                    stock_actual=int(articulo_vendidos.stock) - int(element['cantidad']), # cantidad actual en stock
                                    cantidad=element['cantidad'],
                                    precio_venta=precio_guardar
                                )
    articulo_venta.save()
    return articulo_venta


def split_component_venta(the_dict, forma_pago, request, articulo_stock):
    ''' desarma el diccionario de las ventas para procesarlo '''
    ''' al final devuelve un diccionario para guardarlo en el historial de ventas '''

    articulo_venta_array = []
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
        # --------- calculos de puntos si hay socio ----------
        if (request.POST.get('canje_socios') == 'true') is False:
            sumar_puntos_socios(request.POST.get('id_socio', None), precio_guardar)
        # ----------------------------------------------------
        # --------- guardar la relacion entra articulo y venta
        articulo_venta = guardar_articulo_venta(articulo_vendidos, element, precio_guardar)
        # ----------------------------------------------------
        # --------- Resta en el stock el articulo vendido ----
        articulo_stock.restar_stock(articulo_venta.articulo.id, articulo_venta.cantidad)
        # ----------------------------------------------------
        articulo_venta_array.append(articulo_venta)

    return articulo_venta_array


def aumentar_precio_credito(precio_venta, porcentaje):
    ''' aumenta el precio de venta para creditos '''
    aumento = (float(precio_venta) * float(porcentaje)) / 100
    return float(precio_venta) + aumento
