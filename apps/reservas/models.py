from django.db import models
from apps.sucursales.models import Sucursal
from apps.clientes.models import Cliente
from apps.articulos.models import Articulo


class Reserva(models.Model):

    cliente = models.ForeignKey(Cliente, blank=True, null=True)
    pedido = models.CharField(max_length=300, blank=True, null=True)
    articulo = models.ForeignKey(Articulo, blank=True, null=True)
    sucursal = models.ForeignKey(Sucursal, blank=True, null=True)
    entrega = models.DecimalField(max_digits=12, decimal_places=2,
                                  null=True, blank=True)
    start = models.DateTimeField(blank=True, null=True)
    end = models.DateTimeField(blank=True, null=True)
    title =  models.CharField(max_length=800, blank=True, null=True)

    class Meta:
        verbose_name = 'Reserva'
        verbose_name_plural = 'Reservas'

    def __str__(self):
        return str(self.pedido)