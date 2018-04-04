from django.contrib import admin

from .models import Caja


class CajaAdmin(admin.ModelAdmin):

    list_display = [
        'fecha',
        'caja_inicial',
        'caja_actual',
        'compras',
        'ventas_efectivo',
        'ventas_debito',
        'ventas_credito',
        'otros_ingresos',
        'otros_gastos'
    ]

    search_fields = [
        'fecha',
        'caja_inicial',
        'caja_actual',
        'compras',
        'ventas_efectivo',
        'ventas_debito',
        'ventas_credito',
        'otros_ingresos',
        'otros_gastos'
    ]

    list_filter = [
        'fecha',
        'caja_inicial',
        'caja_actual',
        'compras',
        'ventas_efectivo',
        'ventas_debito',
        'ventas_credito',
        'otros_ingresos',
        'otros_gastos'
    ]

admin.site.register(Caja, CajaAdmin)
