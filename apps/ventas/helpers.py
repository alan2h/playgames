
import json
from django.http import JsonResponse

from apps.articulos.models import Articulo
from apps.ventas.models import ArticuloVenta, Venta

from apps.lib.cajas.gestion import CajaFunctions
from apps.lib.articulos.gestion_stock import ArticuloStock

from apps.socios_puntos.models import PuntoConfiguracion
from apps.clientes.models import Cliente
from apps.sucursales.models import Sucursal


def ajax_guardar_venta(request):
    articulo_venta_array = []
    forma_pago = request.POST.get('forma_pago')
    credito_porcentaje = request.POST.get('credito_porcentaje')
    porcentaje_descuento = request.POST.get('porcentaje_descuento')
    
    caja_funciones = CajaFunctions()
    articulo_stock = ArticuloStock()
    sucursal = Sucursal.objects.get(pk=request.session['id_sucursal'])

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

                # calculos de puntos si hay socio
                if request.POST.get('id_socio') != '':
                    pesos_puntos = PuntoConfiguracion.objects.all()[0]
                    cliente = Cliente.objects.get(pk=request.POST.get('id_socio'))
                   
                    cantidad_puntos = (int(precio_guardar) / int(pesos_puntos.precio)) * int(pesos_puntos.punto)
                    if (cliente.puntos): 
                        cliente.puntos = int(cliente.puntos) + int(cantidad_puntos)
                    else:
                        cliente.puntos = int(cantidad_puntos)
                    cliente.save()
                # calculos de puntos si hay socio  

                articulo_venta = ArticuloVenta(
                    articulo=articulo_vendidos,
                    stock_anterior=articulo_vendidos.stock,
                    cantidad=element['cantidad'],
                    precio_venta=precio_guardar)

                articulo_venta.save()
                # Resta en el stock el articulo vendido
                articulo_stock.restar_stock(articulo_venta.articulo.id,
                                            articulo_venta.cantidad)

                articulo_venta_array.append(articulo_venta)
            # esta variable se guardara en el modelo venta
            # la idea es registrar las ventas que no ingresan a caja para poder anularlas
            venta_sin_ganancia = (request.POST.get('no_sumar') == 'true') 
           
            if forma_pago == 'descuento':
                con_descuento = (float(request.POST.get('precio_venta_total')) * float(porcentaje_descuento)) / 100
                resultado_descuento = float(request.POST.get('precio_venta_total')) - float(con_descuento)
                venta = Venta(
                    fecha=request.POST.get('fecha'),
                    precio_venta_total=resultado_descuento,
                    venta_sin_ganancia=venta_sin_ganancia,
                    forma_pago=forma_pago,
                    porcentaje_aumento=credito_porcentaje,
                    porcentaje_descuento=porcentaje_descuento,
                    sucursal=sucursal,
                    usuario=str(request.user.get_username())
                )
                venta.save()
            else:    
                venta = Venta(
                    fecha=request.POST.get('fecha'),
                    precio_venta_total=request.POST.get('precio_venta_total'),
                    venta_sin_ganancia=venta_sin_ganancia,
                    forma_pago=forma_pago,
                    porcentaje_aumento=credito_porcentaje,
                    porcentaje_descuento=porcentaje_descuento,
                    sucursal=sucursal,
                    usuario=str(request.user.get_username())
                )
                venta.save()

            # Guarda en la caja el precio total del efectivo
            if forma_pago == 'efectivo':
                if (request.POST.get('no_sumar') == 'true'): # esta condicion verifica que se haya tildado que no sume a caja
                    # en caso de que no sume a caja, ira a un campo especial que lo acumula
                    caja_funciones.sumar_sin_ganancia(monto=request.POST.get('precio_venta_total'), 
                                                      id_sucursal=request.session['id_sucursal'])
                else:
                    caja_funciones.sumar_venta_efectivo(precio_efectivo=
                                                        request.POST.get(
                                                            'precio_venta_total'), id_sucursal=request.session['id_sucursal'])
            if forma_pago == 'descuento':
                if (request.POST.get('no_sumar') == 'true'): # esta condicion verifica que se haya tildado que no sume a caja
                    # en caso de que no sume a caja, ira a un campo especial que lo acumula
                    caja_funciones.sumar_sin_ganancia(monto=request.POST.get('total_con_descuento'), 
                                                      id_sucursal=request.session['id_sucursal'])
                else:
                    caja_funciones.sumar_venta_descuento(precio_efectivo=
                                                        request.POST.get(
                                                            'total_con_descuento'), id_sucursal=request.session['id_sucursal'])
            if forma_pago == 'debito':
                if (request.POST.get('no_sumar') == 'true'): # esta condicion verifica que se haya tildado que no sume a caja
                    # en caso de que no sume a caja, ira a un campo especial que lo acumula
                    caja_funciones.sumar_sin_ganancia(monto=request.POST.get('precio_venta_total'), 
                                                      id_sucursal=request.session['id_sucursal'])
                else:
                    caja_funciones.sumar_venta_debito(precio_debito=request.POST
                                                  .get('precio_venta_total'), id_sucursal=request.session['id_sucursal'])
            if forma_pago == 'credito':
                aumento = (float(request.POST.get('precio_venta_total')) *
                           float(credito_porcentaje)) / 100
                precio_aumentado = \
                    float(request.POST.get('precio_venta_total')) + aumento

                if (request.POST.get('no_sumar') == 'true'): # esta condicion verifica que se haya tildado que no sume a caja
                    # en caso de que no sume a caja, ira a un campo especial que lo acumula
                    caja_funciones.sumar_sin_ganancia(monto=precio_aumentado, 
                                                      id_sucursal=request.session['id_sucursal'])
                else:
                    caja_funciones.sumar_venta_credito(
                        precio_credito=precio_aumentado, id_sucursal=request.session['id_sucursal'])

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
