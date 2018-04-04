from django.contrib import admin

from .models import Cliente, Contacto


class ClienteAdmin(admin.ModelAdmin):

    list_display = [
        'nombre',
        'apellido',
        'direccion'
    ]

    search_fields = [
        'nombre',
        'apellido',
        'direccion'
    ]

    list_filter = [
        'nombre',
        'apellido',
        'direccion'
    ]


class ContactoAdmin(admin.ModelAdmin):

    list_display = [
        'tipo',
        'descripcion'
    ]

    list_filter = [
        'tipo',
        'descripcion'
    ]

    search_fields = [
        'tipo',
        'descripcion'
    ]

admin.site.register(Cliente, ClienteAdmin)
admin.site.register(Contacto, ContactoAdmin)
