from django.contrib import admin

from .models import Cliente, Contacto, Cuota, TipoCliente


class ClienteAdmin(admin.ModelAdmin):

    list_display = [
        'nombre',
        'apellido',
        'puntos',
        'puntos_premium',
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


class CuotaAdmin(admin.ModelAdmin):

    list_display =[
        'precio',
        'mes'
    ]

    list_filter = [
        'precio',
        'mes'
    ]


class TipoClienteAdmin(admin.ModelAdmin):

    list_display = [
        'descripcion'
    ]

    search_fields = [
        'descripcion'
    ]

    list_filter = [
        'descripcion'
    ]


admin.site.register(Cliente, ClienteAdmin)
admin.site.register(Contacto, ContactoAdmin)
admin.site.register(Cuota, CuotaAdmin)
admin.site.register(TipoCliente, TipoClienteAdmin)
