from django.db import models
from django.contrib.auth.models import User

from apps.sucursales.models import Sucursal
from django.conf import settings


class Marca(models.Model):

    descripcion = models.CharField(max_length=600, null=False, blank=False)

    def __str__(self):
        return self.descripcion

    class Meta:
        verbose_name = 'Marca'
        verbose_name_plural = 'Marcas'


class Categoria(models.Model):

    descripcion = models.CharField(max_length=600, blank=True, null=True)
    imagen = models.ImageField(upload_to='categorias_web', blank=True, null=True)

    def __str__(self):
        return self.descripcion

    class Meta:
        verbose_name = 'Categoría'
        verbose_name_plural = 'Categorías'


class Rubro(models.Model):

    categoria = models.ForeignKey(Categoria, blank=False, null=False)
    descripcion = models.CharField(max_length=600, null=False, blank=False)

    def __str__(self):
        return self.descripcion

    class Meta:
        verbose_name = 'Rubro'
        verbose_name_plural = 'Rubros'


class Articulo(models.Model):

    codigo_barra = models.CharField(max_length=3000, null=True, blank=True)
    nombre = models.CharField(max_length=1000, blank=False, null=False)
    descripcion = models.CharField(max_length=1000, null=True, blank=True)
    marca = models.ForeignKey(Marca, null=True, blank=True)
    rubro = models.ForeignKey(Rubro, null=True, blank=True)
    # Tipos de Precios -- solo se tiene en cuenta de credito y debito
    precio_venta = models.DecimalField(decimal_places=2, max_digits=12,
                                       null=True, blank=True)
    precio_credito = models.DecimalField(decimal_places=2, max_digits=12,
                                         null=True, blank=True)
    precio_debito = models.DecimalField(decimal_places=2, max_digits=12,
                                        null=True, blank=True)
    precio_web = models.DecimalField(decimal_places=2, max_digits=12,
                                     null=True, blank=True)
    # Tipos de Precios -- solo se tiene en cuenta de credito y debito
    precio_compra = models.DecimalField(default=0, decimal_places=2,
                                        max_digits=12, null=True, blank=True)
    stock = models.IntegerField(null=False, blank=False)
    stock_minimo = models.IntegerField(null=True, blank=True)
    stock_web = models.IntegerField(default=0, null=True, blank=True)

    imagen = models.ImageField(upload_to='articulos', null=True, blank=True)
    impuesto_interno = models.IntegerField(default=0, blank=True, null=True)
    alicuota_iva = models.IntegerField(default=21, null=True, blank=True)
    fecha_compra = models.DateTimeField(auto_created=True)
    fecha_modificacion = models.DateTimeField(auto_now_add=True)
    sucursal = models.ForeignKey(Sucursal, blank=True, null=True)
    # cantidad vendida, esto marca un historial de la cantidad vendidad de un articulo
    cantidad_vendida = models.IntegerField(default='0', null=True, blank=True)
    # si el articulo no se suma a caja este check debe tildarse. Si suma debe ser falso
    no_suma_caja = models.BooleanField(default=False)

    # Baja
    baja = models.BooleanField(default=False)
    fecha_baja = models.DateField(null=True, blank=True)
    causa_baja = models.TextField(max_length=600, null=True, blank=True)

    def __str__(self):
        return '%s, %s' % (self.descripcion, self.nombre)

    class Meta:
        verbose_name = 'Árticulos'
        verbose_name_plural = 'Árticulos'


class HistorialPreciosVenta(models.Model):

    ''' guarda el historial de precios
    de ventas, a medida que se va cambiando  '''

    articulo = models.ForeignKey(Articulo, null=False, blank=False)
    fecha_modificacion = models.DateField(auto_created=True)
    precio = models.DecimalField(decimal_places=2, max_digits=12,
                                 null=False, blank=False)

    def __str__(self):
        return str(self.precio)

    class Meta:

        verbose_name = 'Historial de Precios de Venta'
        verbose_name_plural = 'Historiales de Precios de Ventas'


class HistorialPreciosCompra(models.Model):

    ''' guarda el historial de precios
    de compras, a medida que se va cambiando  '''

    articulo = models.ForeignKey(Articulo, null=False, blank=False)
    fecha_modificacion = models.DateField(auto_created=True)
    precio = models.DecimalField(decimal_places=2, max_digits=12,
                                 null=False, blank=False)

    def __str__(self):
        return str(self.precio)

    class Meta:

        verbose_name = 'Historial de Precios de Compra'
        verbose_name_plural = 'Historiales de Precios de Compras'


class HistorialMovimientoStock(models.Model):

    ''' guarda el historial de movimientos de articulos
        de stock, desde ventas a movimientos de sucursales
    '''

    fecha = models.DateField(auto_now_add=True)
    articulo = models.ForeignKey(Articulo, null=True, blank=True)
    movimiento = models.CharField(max_length=3000, null=True, blank=True)
    usuario = models.ForeignKey(User, null=True, blank=True)

    class Meta:
        verbose_name = 'Historial de movimiento de stock'
        verbose_name_plural = 'Historial de movimientos de stock'

    def __str__(self):

        return str(self.articulo.nombre)
