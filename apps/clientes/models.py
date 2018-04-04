from django.db import models


from django.db import models


class Cliente(models.Model):

    nombre = models.CharField(max_length=600, null=False, blank=False)
    apellido = models.TextField(max_length=800, null=True, blank=True)
    direccion = models.TextField(max_length=800, null=True, blank=True)
    # Baja
    baja = models.BooleanField(default=False)
    fecha_baja = models.DateField(null=True, blank=True)
    causa_baja = models.TextField(max_length=600, null=True, blank=True)

    def __str__(self):
        return str(self.nombre)

    class Meta:
        verbose_name = 'Cliente'
        verbose_name_plural = 'Clientes'


class Contacto(models.Model):

    choices = (
        ('celular', 'celular'),
        ('email', 'email'),
        ('telefono_trabajo', 'Telefono del Trabajo'),
        ('telefono_casa', 'Telefono de la casa'),
        ('telefono1', 'Telefono 1'),
        ('telefono_casa2', 'Telefono 2')
    )

    cliente = models.ForeignKey(Cliente, null=False, blank=False)
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
