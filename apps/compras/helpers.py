
import json
from django.http import JsonResponse

from apps.articulos.models import Articulo
from apps.compras.models import ArticuloCompra, Compra
from apps.proveedores.models import Proveedor

from apps.lib.cajas.gestion import CajaFunctions
from apps.lib.articulos.gestion_stock import ArticuloStock


def ajax_guardar_compra(request):
    articulo_compra_array = []
    caja_funciones = CajaFunctions()
    articulo_stock = ArticuloStock()

    if request.is_ajax():
        if 'compras' in request.POST:
            compras = request.POST.get('compras')
            the_dict = json.loads(compras)
            for element in the_dict:
                articulo_comprados = Articulo.objects.get(
                    pk=element['id'])
                articulo_compra = ArticuloCompra(
                    articulo=articulo_comprados,
                    cantidad=element['cantidad'],
                    precio_compra=articulo_comprados.precio_compra)
                articulo_compra.save()
                # Suma en el stock el articulo comprado
                articulo_stock.sumar_stock(articulo_compra.articulo.id,
                                           articulo_compra.cantidad)

                articulo_compra_array.append(articulo_compra)
            compra = Compra(fecha=request.POST.get('fecha'),
                            codigo_comprobante=
                            request.POST.get('codigo_comprobante'),
                            precio_compra_total=request.POST.get('precio_compra_total')
                            )
            compra.save()

            caja_funciones.sumar_compra(request.POST.get('precio_compra_total'))

            for a in articulo_compra_array:
                compra.articulo_compra.add(a)
        data = {
            'success': 'La compra se registro con éxito'
        }
        return JsonResponse(data)
