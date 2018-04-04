from django.contrib import admin

from apps.compras.models import ArticuloCompra, Compra


class ArticuloCompraAdmin(admin.ModelAdmin):

    list_display = [
        'cantidad',
        'articulo',
        'precio_compra'
    ]

    list_filter = [
        'cantidad',
        'articulo',
        'precio_compra'
    ]

    search_fields = [
        'cantidad',
        'articulo',
        'precio_compra'
    ]


class CompraAdmin(admin.ModelAdmin):

    list_display = [
        'fecha',
        'codigo_comprobante',
        'precio_compra_total',
        'baja'
    ]

    search_fields = [
        'fecha',
        'codigo_comprobante',
        'precio_compra_total'
    ]

    list_filter = [
        'fecha',
        'codigo_comprobante',
        'precio_compra_total'
    ]

admin.site.register(ArticuloCompra, ArticuloCompraAdmin)
admin.site.register(Compra, CompraAdmin)
