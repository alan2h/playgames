
from django.db import models

from apps.articulos.models import Articulo
from apps.sucursales.models import Sucursal

class ArticuloVenta(models.Model):

    cantidad = models.IntegerField(null=False, blank=False)
    articulo = models.ForeignKey(Articulo, null=False, blank=False)
    # stock anterior: audtoria, para un mejor control. 
    stock_anterior = models.IntegerField(null=True, blank=True)
    stock_actual = models.IntegerField(default=0, null=True, blank=True)
    precio_venta = models.DecimalField(decimal_places=2, max_digits=12,
                                       null=False, blank=False)

    def __str__(self):
        return str(self.articulo)

    class Meta:
        verbose_name = 'Árticulo y venta'
        verbose_name_plural = 'Árticulos y Ventas'


class Venta(models.Model):

    fecha = models.DateTimeField(auto_now_add=True)
    fecha_no_time = models.DateField(auto_now=True)
    forma_pago = models.CharField(max_length=400, null=True, blank=True)
    porcentaje_aumento = models.IntegerField(null=True, blank=True)
    porcentaje_descuento = models.IntegerField(null=True, blank=True)
    articulo_venta = models.ManyToManyField(ArticuloVenta,
                                            blank=False)
    precio_venta_total = models.DecimalField(decimal_places=2, max_digits=12,
                                             null=False, blank=False)
    # este campo es para las ventas que que no ingresan a caja
    venta_sin_ganancia = models.BooleanField(default=False) 
    # sucursal para dividir las ventas 
    sucursal = models.ForeignKey(Sucursal, null=True, blank=True)
    # para controlar quien vende
    usuario = models.CharField(max_length=900, null=True, blank=True)
    # Baja
    baja = models.BooleanField(default=False)
    fecha_baja = models.DateField(null=True, blank=True)
    causa_baja = models.TextField(max_length=600, null=True, blank=True)

    def get_parents(self):
        return ",".join([str(p) for p in self.articulo_venta.all()])

    class Meta:
        verbose_name = 'Venta'
        verbose_name_plural = 'Ventas'
