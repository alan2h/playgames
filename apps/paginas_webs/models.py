from django.db import models


class Slides(models.Model):

    imagen = models.ImageField(upload_to='pagina_web', blank=False, null=False)

    def __str__(self):

        return str(self.imagen)

    class Meta:
        verbose_name = 'Slide'
        verbose_name_plural = 'Slides'
