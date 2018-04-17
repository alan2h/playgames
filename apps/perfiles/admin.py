from django.contrib import admin

from .models import Permiso, Perfil


class PermisoAdmin(admin.ModelAdmin):

    list_display = [
        'nombre'
    ]

    search_fields = [
        'nombre'
    ]

    list_filter = [
        'nombre'
    ]


class PerfilAdmin(admin.ModelAdmin):
    
    list_display = [
        'usuario',
        'sucursal'
    ]

    search_fields = [
        'usuario',
        'sucursal'
    ]

    list_filter = [
        'usuario',
        'sucursal'
    ]

admin.site.register(Permiso, PermisoAdmin)
admin.site.register(Perfil, PerfilAdmin)
