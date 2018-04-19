from django.contrib import admin

from .models import PuntoConfiguracion


class PuntoConfiguracionAdmin(admin.ModelAdmin):

    list_display = [
        'precio',
        'punto'
    ]

    list_fitler = [
        'precio',
        'punto'
    ]


admin.site.register(PuntoConfiguracion, PuntoConfiguracionAdmin)
