
from apps.articulos.models import Articulo


class ArticuloStock(object):

    def restar_stock(self, id, cantidad):

        articulo = Articulo.objects.get(pk=id)
        if articulo.stock is not None:
            # formula: resta stock en caso de venta
            # codicion: verifico que el stock sea mayor 0
            if int(articulo.stock) > 0:
                articulo.stock = int(articulo.stock) - int(cantidad)
            # formula: suma la cantidad vendida en caso de venta
            articulo.cantidad_vendida = int(articulo.cantidad_vendida) + int(cantidad)
            articulo.save()

    def sumar_stock(self, id, cantidad):

        articulo = Articulo.objects.get(pk=id)
        if articulo.stock is not None:
            # formula: suma stock en caso de anular venta o que se realice compra.
            articulo.stock = int(articulo.stock) + int(cantidad)
            articulo.save()

    def restar_vendida(self, id, cantidad):

        articulo = Articulo.objects.get(pk=id)
        if articulo.stock is not None:
            # formula: en caso de anular venta resta la cantidad vendida.
            articulo.cantidad_vendida = int(articulo.cantidad_vendida) - int(cantidad)
            articulo.save()
