from django.db import models


class Proveedor(models.Model):

    nombre = models.CharField(max_length=600, null=False, blank=False)
    direccion = models.TextField(max_length=800, null=True, blank=True)
    # Baja
    baja = models.BooleanField(default=False)
    fecha_baja = models.DateField(null=True, blank=True)
    causa_baja = models.TextField(max_length=600, null=True, blank=True)

    def __str__(self):
        return str(self.nombre)

    class Meta:
        verbose_name = 'Proveedor'
        verbose_name_plural = 'Proveedores'


class Contacto(models.Model):

    choices = (
        ('celular', 'celular'),
        ('email', 'email'),
        ('telefono_trabajo', 'Telefono del Trabajo'),
        ('telefono_casa', 'Telefono de la casa'),
        ('telefono1', 'Telefono 1'),
        ('telefono_casa2', 'Telefono 2')
    )

    proveedor = models.ForeignKey(Proveedor, null=False, blank=False)
    tipo = models.CharField(choices=choices, max_length=200
                            , null=False, blank=False)
    descripcion = models.CharField(max_length=600, null=False, blank=False)
    # Baja
    baja = models.BooleanField(default=False)
    fecha_baja = models.DateField(null=True, blank=True)
    causa_baja = models.TextField(max_length=600, null=True, blank=True)

    def __str__(self):
        return '%s - %s' % (self.tipo, self.descripcion)

    class Meta:
        verbose_name = 'Contacto'
        verbose_name_plural = 'Contactos'
