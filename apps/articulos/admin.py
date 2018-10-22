from django.contrib import admin

from .models import (Articulo, Marca, Rubro,
    HistorialPreciosCompra, HistorialPreciosVenta, Categoria)


class MarcaAdmin(admin.ModelAdmin):

    list_display = [
        'descripcion'
    ]

    list_filter = [
        'descripcion'
    ]

    search_fields = [
        'descripcion'
    ]


class CategoriaAdmin(admin.ModelAdmin):

    list_display = [
        'descripcion'
    ]

    list_filter = [
        'descripcion'
    ]

    search_fields = [
        'descripcion'
    ]

class RubroAdmin(admin.ModelAdmin):

    list_display = [
        'categoria',
        'descripcion'
    ]

    list_filter = [
        'descripcion'
    ]

    search_fields = [
        'descripcion'
    ]


class ArticuloAdmin(admin.ModelAdmin):

    list_display = [
        'id',
        'codigo_barra',
        'descripcion',
        'precio_compra',
        'precio_venta',
        'precio_credito',
        'precio_debito',
        'stock',
        'stock_minimo',
        'stock_web',
        'imagen',
        'impuesto_interno',
        'alicuota_iva',
        'fecha_compra',
        'fecha_modificacion'
    ]

    search_fields = [
        'descripcion',
        'marca__descripcion',
        'rubro__descripcion',
        'precio_compra',
        'precio_venta',
        'precio_credito',
        'precio_debito',
        'stock',
        'stock_minimo',
        'impuesto_interno',
        'alicuota_iva',
        'fecha_compra',
        'fecha_modificacion'
    ]

    list_filter = [
        'descripcion',
        'precio_compra',
        'stock',
        'stock_minimo',
        'impuesto_interno',
        'alicuota_iva',
        'fecha_compra',
        'fecha_modificacion'
    ]


class HistorialPreciosCompraAdmin(admin.ModelAdmin):

    list_display = [
        'fecha_modificacion',
        'precio'
    ]

    search_fields = [
        'fecha_modificacion',
        'precio'
    ]

    list_filter = [
        'fecha_modificacion',
        'precio'
    ]


class HistorialPreciosVentaAdmin(admin.ModelAdmin):

    list_display = [
        'fecha_modificacion',
        'articulo',
        'precio'
    ]

    search_fields = [
        'fecha_modificacion',
        'articulo',
        'precio'
    ]

    list_filter = [
        'fecha_modificacion',
        'precio'
    ]

admin.site.register(Categoria, CategoriaAdmin)
admin.site.register(Rubro, RubroAdmin)
admin.site.register(Marca, MarcaAdmin)
admin.site.register(Articulo, ArticuloAdmin)
admin.site.register(HistorialPreciosCompra, HistorialPreciosCompraAdmin)
admin.site.register(HistorialPreciosVenta, HistorialPreciosVentaAdmin)
