
from datetime import datetime, timedelta, time

from apps.cajas.models import Caja
from apps.perfiles.models import Perfil
from apps.sucursales.models import Sucursal


class CajaCreateIfNoExist(object):

    def dispatch(self, request, *args, **kwargs):

        id_sucursal = self.request.session['id_sucursal']
        sucursal = Sucursal.objects.get(pk=id_sucursal)

        today = datetime.now().date()
        caja = Caja.objects.filter(fecha=today, sucursal__id=id_sucursal)
        if caja.exists() is False:
            caja = Caja(fecha=today, caja_inicial=0, sucursal=sucursal)
            caja.save()

        return super(CajaCreateIfNoExist, self).dispatch(request,
                                                         *args, **kwargs)


class CajaFunctions(object):

    def exists(self, id_sucursal=None):
        # sucursal = Sucursal.objects.get(pk=id_sucursal)

        today = datetime.now().date()
        caja = Caja.objects.filter(fecha=today, sucursal=id_sucursal)
        return caja.exists()

    def first_field_pk(self, id_sucursal=None):

        today = datetime.now().date()
        caja = Caja.objects.filter(fecha=today, sucursal=id_sucursal)
        return str(caja[0].pk)

    def sumar_venta_efectivo(self, precio_efectivo, id_sucursal=None):

        today = datetime.now().date()
        sucursal = Sucursal.objects.get(pk=id_sucursal)

        caja = Caja.objects.filter(fecha=today, sucursal__id=id_sucursal)
        if caja.exists() is False:
            caja = Caja(fecha=today, caja_inicial=0, sucursal=sucursal)
            caja.save()

        caja = Caja.objects.filter(fecha=today, sucursal__id=id_sucursal)[0]

        if caja.ventas_efectivo is not None:
            resultado = float(precio_efectivo) + float(caja.ventas_efectivo)
            caja.ventas_efectivo = resultado
        else:
            caja.ventas_efectivo = precio_efectivo
        caja.save()
        self.saldo_caja(id_sucursal)

    def sumar_venta_descuento(self, precio_efectivo, id_sucursal=None):

        today = datetime.now().date()
        caja = Caja.objects.filter(fecha=today, sucursal__id=id_sucursal)
        sucursal = Sucursal.objects.get(pk=id_sucursal)
        if caja.exists() is False:
            caja = Caja(fecha=today, caja_inicial=0, sucursal=sucursal)
            caja.save()

        caja = Caja.objects.filter(fecha=today, sucursal__id=id_sucursal)[0]

        if caja.ventas_efectivo is not None:
            resultado = float(precio_efectivo) + float(caja.ventas_efectivo)
            caja.ventas_efectivo = resultado
        else:
            caja.ventas_efectivo = precio_efectivo
        caja.save()
        self.saldo_caja(id_sucursal)

    def sumar_venta_debito(self, precio_debito, id_sucursal=None):

        today = datetime.now().date()
        caja = Caja.objects.filter(fecha=today, sucursal__id=id_sucursal)
        sucursal = Sucursal.objects.get(pk=id_sucursal)
        if caja.exists() is False:
            caja = Caja(fecha=today, caja_inicial=0, sucursal=sucursal)
            caja.save()

        caja = Caja.objects.filter(fecha=today, sucursal__id=id_sucursal)[0]

        if caja.ventas_debito is not None:
            resultado = float(precio_debito) + float(caja.ventas_debito)
            caja.ventas_debito = resultado
        else:
            caja.ventas_debito = precio_debito
        caja.save()
        self.saldo_caja(id_sucursal)

    def sumar_venta_credito(self, precio_credito, id_sucursal=None):

        today = datetime.now().date()
        caja = Caja.objects.filter(fecha=today, sucursal__id=id_sucursal)
        sucursal = Sucursal.objects.get(pk=id_sucursal)
        if caja.exists() is False:
            caja = Caja(fecha=today, caja_inicial=0, sucursal=sucursal)
            caja.save()

        caja = Caja.objects.filter(fecha=today, sucursal__id=id_sucursal)[0]

        if caja.ventas_credito is not None:
            resultado = float(precio_credito) + float(caja.ventas_credito)
            caja.ventas_credito = resultado
        else:
            caja.ventas_credito = precio_credito
        caja.save()
        self.saldo_caja(id_sucursal)

    def sumar_compra(self, precio_compra, id_sucursal=None):

        today = datetime.now().date()
        caja = Caja.objects.filter(fecha=today, sucursal__id=id_sucursal)
        sucursal = Sucursal.objects.get(pk=id_sucursal)
        if caja.exists() is False:
            caja = Caja(fecha=today, caja_inicial=0, sucursal=sucursal)
            caja.save()

        caja = Caja.objects.filter(fecha=today, sucursal__id=id_sucursal)[0]

        if caja.compras is not None:
            resultado = float(precio_compra) + float(caja.compras)
            caja.compras = resultado
        else:
            caja.compras = precio_compra
        caja.save()
        self.saldo_caja(id_sucursal)

    def restar_compra(self, precio_compra, id_sucursal=None):

        today = datetime.now().date()
        caja = Caja.objects.filter(fecha=today, sucursal__id=id_sucursal)
        sucursal = Sucursal.objects.get(pk=id_sucursal)
        if caja.exists() is False:
            caja = Caja(fecha=today, caja_inicial=0, sucursal=sucursal)
            caja.save()

        caja = Caja.objects.filter(fecha=today, sucursal__id=id_sucursal)[0]

        if caja.compras is not None:
            resultado = float(precio_compra) - float(caja.compras)
            if resultado > 0:
                caja.compras = resultado
            else:
                caja.compras = resultado * -1
        else:
            caja.compras = precio_compra
        caja.save()
        self.saldo_caja(id_sucursal)

    def sumar_gasto(self, monto_gasto, id_sucursal=None):

        today = datetime.now().date()
        caja = Caja.objects.filter(fecha=today, sucursal__id=id_sucursal)
        sucursal = Sucursal.objects.get(pk=id_sucursal)
        if caja.exists() is False:
            caja = Caja(fecha=today, caja_inicial=0, sucursal=sucursal)
            caja.save()

        caja = Caja.objects.filter(fecha=today, sucursal__id=id_sucursal)[0]

        if caja.otros_gastos is not None:
            resultado = float(monto_gasto) + float(caja.otros_gastos)
            caja.otros_gastos = resultado
        else:
            caja.otros_gastos = monto_gasto
        caja.save()
        self.saldo_caja(id_sucursal)

    def sumar_ingreso(self, monto_ingreso, id_sucursal=None):

        today = datetime.now().date()
        caja = Caja.objects.filter(fecha=today, sucursal__id=id_sucursal)
        sucursal = Sucursal.objects.get(pk=id_sucursal)
        if caja.exists() is False:
            caja = Caja(fecha=today, caja_inicial=0, sucursal=sucursal)
            caja.save()

        caja = Caja.objects.filter(fecha=today, sucursal__id=id_sucursal)[0]

        if caja.otros_ingresos is not None:
            resultado = float(monto_ingreso) + float(caja.otros_ingresos)
            caja.otros_ingresos = resultado
        else:
            caja.otros_ingresos = monto_ingreso
        caja.save()
        self.saldo_caja(id_sucursal)

    def sumar_sin_ganancia(self, monto, id_sucursal=None):

        today = datetime.now().date()
        caja = Caja.objects.filter(fecha=today, sucursal__id=id_sucursal)
        sucursal = Sucursal.objects.get(pk=id_sucursal)
        if caja.exists() is False:
            caja = Caja(fecha=today, caja_inicial=0, sucursal=sucursal)
            caja.save()

        caja = Caja.objects.filter(fecha=today, sucursal__id=id_sucursal)[0]

        if caja.venta_sin_ganancia is not None:
            resultado = float(monto) + float(caja.venta_sin_ganancia)
            caja.venta_sin_ganancia = resultado
        else:
            caja.venta_sin_ganancia = monto
        caja.save()
        self.saldo_caja(id_sucursal)

    def restar_gasto(self, monto_gasto, id_sucursal=None):

        today = datetime.now().date()
        caja = Caja.objects.filter(fecha=today, sucursal__id=id_sucursal)
        sucursal = Sucursal.objects.get(pk=id_sucursal)
        if caja.exists() is False:
            caja = Caja(fecha=today, caja_inicial=0, sucursal=sucursal)
            caja.save()

        caja = Caja.objects.filter(fecha=today, sucursal__id=id_sucursal)[0]

        if caja.otros_gastos is not None:
            resultado = float(monto_gasto) - float(caja.otros_gastos)
            if resultado > 0:
                caja.otros_gastos = resultado
            else:
                caja.otros_gastos = resultado * -1
        else:
            caja.otros_gastos -= monto_gasto
        caja.save()
        self.saldo_caja(id_sucursal)

    def restar_ingreso(self, monto_ingreso, id_sucursal=None):

        today = datetime.now().date()
        caja = Caja.objects.filter(fecha=today, sucursal__id=id_sucursal)
        sucursal = Sucursal.objects.get(pk=id_sucursal)
        if caja.exists() is False:
            caja = Caja(fecha=today, caja_inicial=0, sucursal=sucursal)
            caja.save()

        caja = Caja.objects.filter(fecha=today, sucursal__id=id_sucursal)[0]

        if caja.otros_ingresos is not None:
            resultado = float(monto_ingreso) - float(caja.otros_ingresos)
            if resultado > 0:
                caja.otros_ingresos = resultado
            else:
                caja.otros_ingresos = resultado * -1
        else:
            caja.otros_ingresos -= monto_ingreso
        caja.save()
        self.saldo_caja(id_sucursal)

    def restar_venta_credito(self, precio_credito, id_sucursal=None):

        today = datetime.now().date()
        caja = Caja.objects.filter(fecha=today, sucursal__id=id_sucursal)
        sucursal = Sucursal.objects.get(pk=id_sucursal)
        if caja.exists() is False:
            caja = Caja(fecha=today, caja_inicial=0, sucursal=sucursal)
            caja.save()

        caja = Caja.objects.filter(fecha=today, sucursal__id=id_sucursal)[0]

        if caja.ventas_credito is not None:
            resultado = float(precio_credito) - float(caja.ventas_credito)
            if resultado > 0:
                caja.ventas_credito = resultado
            else:
                caja.ventas_credito = resultado * -1
        else:
            caja.ventas_credito = precio_credito
        caja.save()
        self.saldo_caja(id_sucursal)

    def restar_venta_debito(self, precio_debito, id_sucursal=None):

        today = datetime.now().date()
        caja = Caja.objects.filter(fecha=today, sucursal__id=id_sucursal)
        sucursal = Sucursal.objects.get(pk=id_sucursal)
        if caja.exists() is False:
            caja = Caja(fecha=today, caja_inicial=0, sucursal=sucursal)
            caja.save()

        caja = Caja.objects.filter(fecha=today, sucursal__id=id_sucursal)[0]

        if caja.ventas_debito is not None:
            resultado = float(precio_debito) - float(caja.ventas_debito)
            if resultado > 0:
                caja.ventas_debito = resultado
            else:
                caja.ventas_debito = resultado * -1
        else:
            caja.ventas_debito = precio_debito
        caja.save()
        self.saldo_caja(id_sucursal)

    def restar_venta_efectivo(self, precio_efectivo, id_sucursal=None):

        today = datetime.now().date()
        caja = Caja.objects.filter(fecha=today, sucursal__id=id_sucursal)
        sucursal = Sucursal.objects.get(pk=id_sucursal)
        if caja.exists() is False:
            caja = Caja(fecha=today, caja_inicial=0, sucursal=sucursal)
            caja.save()

        caja = Caja.objects.filter(fecha=today, sucursal__id=id_sucursal)[0]

        if caja.ventas_efectivo is not None:
            resultado = float(precio_efectivo) - float(caja.ventas_efectivo)
            if resultado > 0:
                caja.ventas_efectivo = resultado
            else:
                caja.ventas_efectivo = resultado * -1
        else:
            caja.ventas_efectivo = precio_efectivo
        caja.save()
        self.saldo_caja(id_sucursal)

    def restar_sin_ganancia(self, venta_sin_ganancia, id_sucursal=None):

        today = datetime.now().date()
        caja = Caja.objects.filter(fecha=today, sucursal__id=id_sucursal)
        sucursal = Sucursal.objects.get(pk=id_sucursal)
        if caja.exists() is False:
            caja = Caja(fecha=today, caja_inicial=0, sucursal=sucursal)
            caja.save()

        caja = Caja.objects.filter(fecha=today, sucursal__id=id_sucursal)[0]

        if caja.venta_sin_ganancia is not None:
            resultado = float(venta_sin_ganancia) - float(caja.venta_sin_ganancia)
            if resultado > 0:
                caja.venta_sin_ganancia = resultado
            else:
                caja.venta_sin_ganancia = resultado * -1
        else:
            caja.venta_sin_ganancia = venta_sin_ganancia
        caja.save()
        self.saldo_caja(id_sucursal)


    def saldo_caja(self, id_sucursal=None):

        today = datetime.now().date()
        caja = Caja.objects.filter(fecha=today, sucursal__id=id_sucursal)[0]
        saldo = 0.0
        if caja.caja_inicial is not None:
            saldo += float(caja.caja_inicial)
        if caja.compras is not None:
            saldo -= float(caja.compras)
        if caja.ventas_efectivo is not None:
            saldo += float(caja.ventas_efectivo)
        if caja.otros_ingresos is not None:
            saldo += float(caja.otros_ingresos)
        if caja.otros_gastos is not None:
            if float(caja.otros_gastos) > 0:
                saldo -= float(caja.otros_gastos)
            else:
                saldo += float(caja.otros_gastos)
        caja.caja_actual = saldo
        caja.save()
