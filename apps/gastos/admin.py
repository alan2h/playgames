from django.contrib import admin

from .models import Gasto


class GastoAdmin(admin.ModelAdmin):

    list_display = [
        'fecha',
        'motivo',
        'monto'
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


admin.site.register(Gasto, GastoAdmin)
