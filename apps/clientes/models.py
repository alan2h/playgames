from django.db import models
import datetime
import django

from apps.sucursales.models import Sucursal


class TipoCliente(models.Model):

    descripcion = models.CharField(max_length=3000, blank=False, null=False)

    def __str__(self):
        return str(self.descripcion)

    class Meta:
        verbose_name = 'Tipo de Cliente'
        verbose_name_plural = 'Tipos de Clientes'


class Cliente(models.Model):

    codigo_barras = models.CharField(max_length=3000, blank=True, null=True)

    tipo_cliente = models.ForeignKey(TipoCliente, blank=True, null=True)
    
    email = models.EmailField(unique=True, blank=True, null=True)
    nombre = models.CharField(max_length=600, null=False, blank=False)
    apellido = models.TextField(max_length=800, null=True, blank=True)
    numero_documento = models.IntegerField(blank=True, null=True)
    direccion = models.TextField(max_length=800, null=True, blank=True)
    fecha_nacimiento = models.DateField(blank=True, null=True)
    fecha_alta = models.DateField(default=django.utils.timezone.now, blank=True, null=True)

    puntos = models.IntegerField(blank=True, null=True)
    puntos_premium = models.IntegerField(blank=True, null=True)

    credito = models.DecimalField(max_digits=12, decimal_places=2,
                                   null=True, blank=True)
    # cada cliente tiene una sucursal
    sucursal = models.ForeignKey(Sucursal, blank=True, null=True)
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


class Cuota(models.Model):

    choices = (
        ('Enero', 'Enero'),
        ('Febrero', 'Febrero'),
        ('Marzo', 'Marzo'),
        ('Abril', 'Abril'),
        ('Mayo', 'Mayo'),
        ('Junio', 'Junio'),
        ('Julio', 'Julio'),
        ('Agosto', 'Agosto'),
        ('Septiembre', 'Septiembre'),
        ('Octubre', 'Octubre'),
        ('Noviembre', 'Noviembre'),
        ('Diciembre', 'Diciembre')
    )

    cliente = models.ForeignKey(Cliente, blank=True, null=True)

    precio = models.DecimalField(max_digits=12, decimal_places=2,
                          blank=False, null=False)
    mes = models.CharField(max_length=3000, choices=choices,
                    blank=False, null=False)
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return '%s - %s' % str(self.precio, self.mes)

    class Meta:
        verbose_name = 'Cuota'
        verbose_name_plural = 'Cuotas'
