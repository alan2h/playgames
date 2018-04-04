from django.contrib import admin

from .models import Contacto, Proveedor


class ContactoAdmin(admin.ModelAdmin):

    list_display = [
        'proveedor',
        'tipo',
        'descripcion'
    ]

    list_filter = [
        'proveedor',
        'tipo',
        'descripcion'
    ]

    search_fields = [
        'proveedor',
        'tipo',
        'descripcion'
    ]


class ProveedorAdmin(admin.ModelAdmin):

    list_display = [
        'nombre',
        'direccion'
    ]

    search_fields = [
        'nombre',
        'direccion'
    ]

    list_filter = [
        'nombre',
        'direccion'
    ]

admin.site.register(Contacto, ContactoAdmin)
admin.site.register(Proveedor, ProveedorAdmin)
