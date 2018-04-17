from django.contrib import admin

from .models import Sucursal


class SucursalAdmin(admin.ModelAdmin):

    list_display = [
        'descripcion'
    ]

    search_fields = [
        'descripcion'
    ]

    list_filter = [
        'descripcion'
    ]

admin.site.register(Sucursal, SucursalAdmin)