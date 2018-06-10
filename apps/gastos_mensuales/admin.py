from django.contrib import admin

from .models import Motivo, GastoMensual


class GastoMensualAdmin(admin.ModelAdmin):
    
    list_display = [
        'id',
        'fecha',
        'motivo',
        'monto'
    ]

    list_filter = [
        'id',
        'fecha',
        'motivo',
        'monto'
    ]

    search_fields = [
        'id',
        'fecha',
        'motivo',
        'monto'
    ]


class MotivoAdmin(admin.ModelAdmin):

    list_display = [
        'id',
        'descripcion',
        'sucursal'
    ]

    search_fields = [
        'id',
        'descripcion'
    ]

    list_filter = [
        'id',
        'descripcion'
    ]

admin.site.register(Motivo, MotivoAdmin)
admin.site.register(GastoMensual, GastoMensualAdmin)