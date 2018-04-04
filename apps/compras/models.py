from django.db import models

from apps.articulos.models import Articulo
from apps.proveedores.models import Proveedor


class ArticuloCompra(models.Model):

    cantidad = models.IntegerField(null=False, blank=False)
    articulo = models.ForeignKey(Articulo, null=False, blank=False)
    precio_compra = models.DecimalField(decimal_places=2, max_digits=12,
                                        null=False, blank=False)
    proveedor = models.ForeignKey(Proveedor, null=True, blank=True)

    class Meta:
        verbose_name = 'Árticulo y compra'
        verbose_name_plural = 'Árticulos y Compras'


class Compra(models.Model):

    fecha = models.DateField(auto_now_add=True)
    codigo_comprobante = models.CharField(max_length=800,
                                          null=True, blank=True)
    articulo_compra = models.ManyToManyField(ArticuloCompra,
                                             blank=False)
    precio_compra_total = models.DecimalField(decimal_places=2, max_digits=12,
                                              null=False, blank=False)

    # Baja
    baja = models.BooleanField(default=False)
    fecha_baja = models.DateField(null=True, blank=True)
    causa_baja = models.TextField(max_length=600, null=True, blank=True)

    class Meta:
        verbose_name = 'Compra'
        verbose_name_plural = 'Compras'
