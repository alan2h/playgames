from django.db import models


class PuntoConfiguracion(models.Model):

    precio = models.DecimalField(decimal_places=2, max_digits=12,
                                       null=True, blank=True)
    punto = models.IntegerField(blank=True, null=True)

    def __str__(self):

        return str(self.punto)

    class Meta:
        verbose_name = 'Punto de configuración'
        verbose_name_plural = 'Puntos de configuraciones'
