from django.db import models

from apps.sucursales.models import Sucursal


class Caja(models.Model):

    fecha = models.DateField(auto_created=True)
    caja_inicial = models.DecimalField(max_digits=12, decimal_places=2,
                                       null=True, blank=True, default=5000)
    caja_actual = models.DecimalField(max_digits=12, decimal_places=2,
                                      null=True, blank=True)
    compras = models.DecimalField(max_digits=12, decimal_places=2,
                                  null=True, blank=True)
    ventas_efectivo = models.DecimalField(max_digits=12, decimal_places=2,
                                          null=True, blank=True)
    ventas_debito = models.DecimalField(max_digits=12, decimal_places=2,
                                        null=True, blank=True)
    ventas_credito = models.DecimalField(max_digits=12, decimal_places=2,
                                         null=True, blank=True)
    venta_sin_ganancia = models.DecimalField(max_digits=12, decimal_places=2,
                                       null=True, blank=True)
    otros_ingresos = models.DecimalField(max_digits=12, decimal_places=2,
                                         null=True, blank=True)
    otros_gastos = models.DecimalField(max_digits=12, decimal_places=2,
                                       null=True, blank=True)
    ventas_socios = models.DecimalField(max_digits=12, decimal_places=2,
                                       null=True, blank=True)
    sucursal = models.ForeignKey(Sucursal, blank=True, null=True)

    def __str__(self):
        return str(self.fecha)

    class Meta:
        verbose_name = 'Caja'
        verbose_name_plural = 'Cajas'

