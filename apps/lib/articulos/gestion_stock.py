
from apps.articulos.models import Articulo


class ArticuloStock(object):

    def restar_stock(self, id, cantidad):

        articulo = Articulo.objects.get(pk=id)
        if articulo.stock is not None:
            articulo.stock = int(articulo.stock) - int(cantidad)
            articulo.save()

    def sumar_stock(self, id, cantidad):

        articulo = Articulo.objects.get(pk=id)
        if articulo.stock is not None:
            articulo.stock = int(articulo.stock) + int(cantidad)
            articulo.save()
