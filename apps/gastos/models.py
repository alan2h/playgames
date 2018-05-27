from django.db import models

from apps.sucursales.models import Sucursal


class Motivo(models.Model):

    descripcion = models.CharField(max_length=1000, blank=True, null=True)
    sucursal = models.ForeignKey(Sucursal, blank=True, null=True)

    def __str__(self):
        return '%s' % self.descripcion

    class Meta:
        verbose_name = 'Motivo'
        verbose_name_plural = 'Motivos'


class Gasto(models.Model):

    fecha = models.DateField(auto_created=True)
    motivo = models.CharField(max_length=600,
                              null=False, blank=False)
    monto = models.DecimalField(max_digits=12, decimal_places=2,
                                null=False, blank=False)
    sucursal = models.ForeignKey(Sucursal, null=True, blank=True)

    def __str__(self):
        return str(self.fecha) + ' - ' + str(self.motivo)

    class Meta:

        verbose_name = 'Gasto'
        verbose_name_plural = 'Gastos'
