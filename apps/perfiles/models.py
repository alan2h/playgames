from django.db import models
from django.contrib.auth.models import User

from apps.sucursales.models import Sucursal


class Permiso(models.Model):

    nombre = models.CharField(max_length=2000, blank=True, null=True)

    class Meta:
        verbose_name = 'Permiso'
        verbose_name_plural = 'Permisos'

    def __str__(self):
        return str(self.nombre)


class Sucursal(models.Model):

    permiso = models.ManyToManyField(Permiso, blank=True)
    usuario = models.ForeignKey(User, related_name='usuarios', on_delete=models.CASCADE)
    sucursal = models.ForeignKey(Sucursal, blank=True, null=True)

    class Meta:
        verbose_name = 'Sucursal'
        verbose_name_plural = 'Sucursales'

    def __str__(self):

        return str(self.usuario)