
from django.contrib import admin

from .models import Venta, ArticuloVenta


class ArticuloVentaAdmin(admin.ModelAdmin):

    list_filter = [
        'cantidad',
        'precio_venta'
    ]

    list_display = [
        'cantidad',
        'articulo',
        'precio_venta'
    ]

    search_fields = [
        'cantidad',
        'precio_venta'
    ]


class VentaAdmin(admin.ModelAdmin):

    list_display = [
        'fecha_no_time',
        'forma_pago',
        'porcentaje_aumento',
        'precio_venta_total',
        'baja'
    ]

    list_filter = [
        'fecha',
        'precio_venta_total'
    ]

    search_fields = [
        'fecha',
        'precio_venta_total'
    ]

admin.site.register(ArticuloVenta, ArticuloVentaAdmin)
admin.site.register(Venta, VentaAdmin)
