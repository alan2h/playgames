from django.contrib import admin

from .models import OtroIngreso


class OtroIngresoAdmin(admin.ModelAdmin):

    list_display = [
        'fecha',
        'motivo',
        'monto'
    ]

    search_fields = [
        'fecha',
        'motivo',
        'monto'
    ]

    list_filter = [
        'fecha',
        'motivo',
        'monto'
    ]

admin.site.register(OtroIngreso, OtroIngresoAdmin)
