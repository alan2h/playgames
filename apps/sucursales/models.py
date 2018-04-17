from django.db import models


class Sucursal(models.Model):
    """Model definition for Sucursal."""

    descripcion = models.CharField(max_length=1000, blank=False, null=False)

    class Meta:
        """Meta definition for Sucursal."""

        verbose_name = 'Sucursal'
        verbose_name_plural = 'Sucursales'

    def __str__(self):
        """Unicode representation of Sucursal."""
        return str(self.descripcion)
