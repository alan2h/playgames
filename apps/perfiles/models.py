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


class Perfil(models.Model):

    ''' el campo permiso hasta ahora no se usa, la idea es que en un 
    futuro el admin pueda darle determinados permisos a sus empleados '''
    permiso = models.ManyToManyField(Permiso, blank=True)
    usuario = models.ForeignKey(User, related_name='usuarios', on_delete=models.CASCADE)
    sucursal = models.ForeignKey(Sucursal, blank=True, null=True)

    class Meta:
        verbose_name = 'Perfil'
        verbose_name_plural = 'Perfiles'

    def __str__(self):

        return str(self.usuario)