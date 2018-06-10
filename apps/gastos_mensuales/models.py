from django.db import models

from apps.sucursales.models import Sucursal


class Motivo(models.Model):

    descripcion = models.CharField(max_length=3000, blank=True, null=True)
    sucursal = models.ForeignKey(Sucursal, blank=True, null=True, related_name='motivo_sucursal')

    def __str__(self):
        return str(self.descripcion)

    class Meta:
        
        verbose_name = 'Motivo'
        verbose_name_plural = 'Motivos'


class GastoMensual(models.Model):

    fecha = models.DateField(auto_now_add=True)
    motivo = models.CharField(max_length=3000, blank=True, null=True)
    monto = models.DecimalField(max_digits=12, decimal_places=2,
                                null=True, blank=True)
    sucursal = models.ForeignKey(Sucursal, blank=True, null=True, related_name='Gasto_mensual_sucursal')

    def __str__(self):
        return '%s - %s' % (self.motivo, self.monto)

    class Meta:

        verbose_name = 'Gasto Mensual'
        verbose_name_plural = 'Gastos Mensuales'