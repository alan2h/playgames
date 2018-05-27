from django.contrib import admin

from .models import Gasto, Motivo


class MotivoAdmin(admin.ModelAdmin): 

    list_display = [
        'descripcion',
        'sucursal'
    ]


class GastoAdmin(admin.ModelAdmin):

    list_display = [
        'fecha',
        'motivo',
        'monto',
        'sucursal'
    ]

    list_filter = [
        'fecha',
        'motivo',
        'monto'
    ]

    search_fields = [
        'fecha',
        'motivo',
        'monto'
    ]


admin.site.register(Motivo, MotivoAdmin)
admin.site.register(Gasto, GastoAdmin)
