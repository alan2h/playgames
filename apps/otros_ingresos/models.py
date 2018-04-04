from django.db import models


class OtroIngreso(models.Model):

    choices_motivos = (
        ('cuenta_corriente_cliente', 'Cuenta CTE cliente'),
        ('diferencia_caja', 'Diferencia con Caja'),
        ('varios', 'Varios')
    )

    fecha = models.DateField(auto_created=True)
    motivo = models.CharField(choices=choices_motivos, max_length=600,
                              null=False, blank=False)
    monto = models.DecimalField(max_digits=12, decimal_places=2,
                                null=False, blank=False)

    def __str__(self):
        return str(self.fecha) + ' - ' + str(self.motivo)

    class Meta:

        verbose_name = 'Otro Ingreso'
        verbose_name_plural = 'Otros Ingresos'
