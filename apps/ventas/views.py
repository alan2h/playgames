
import datetime

from django.contrib.messages.views import SuccessMessageMixin
from django.contrib import messages
from django.http import HttpResponseRedirect
from django.views.generic import CreateView, DetailView, ListView, DeleteView

from apps.articulos.models import Articulo
from apps.cajas.models import Caja

from .forms import VentaForm
from .models import Venta, ArticuloVenta

from apps.lib.cajas.gestion import CajaCreateIfNoExist, CajaFunctions
from apps.lib.socios.gestion import SocioFunctions
from apps.lib.articulos.gestion_stock import ArticuloStock


class VentaCreateView(CajaCreateIfNoExist, SuccessMessageMixin, CreateView):

    model = Venta
    form_class = VentaForm
    success_url = '/ventas/alta/'
    success_message = 'La venta se realizo con éxito'

    def get_context_data(self, **kwargs):
        context = super(VentaCreateView, self).get_context_data(**kwargs)
        context['articulos'] = Articulo.objects.filter(baja=False)
        return context


class TicketDetailView(DetailView):

    model = Venta
    template_name = 'ventas/ticket.html'

    def get_context_data(self, **kwargs):
        context = super(TicketDetailView, self).get_context_data(**kwargs)
        venta = Venta.objects.get(pk=self.kwargs['pk'])
        if venta.forma_pago == 'credito':
            aumento = \
                (float(venta.precio_venta_total) * float(venta.porcentaje_aumento))/100
            total_sin_formato = str(float(venta.precio_venta_total) + float(aumento))
            context['total'] = "%.2f" % float(total_sin_formato)
        else:
            context['total'] = venta.precio_venta_total
        return context


class VentaListView(ListView):

    queryset = Venta.objects.filter(baja=False, fecha_no_time=datetime.datetime.now()).order_by('-id')
    template_name = 'ventas/venta_report.html'

    def get_queryset(self):
        queryset = super(VentaListView, self).get_queryset()
        queryset = Venta.objects.filter(
            baja=False,
            fecha_no_time=datetime.datetime.now(),
            sucursal=self.request.session.get('id_sucursal')).order_by('-id')
        return queryset


class VentaDeleteView(DeleteView):

    model = Venta
    template_name = 'ventas/venta_confirm_delete.html'
    success_url = '/ventas/informe/'

    def delete(self, request, *args, **kwargs):

        caja_funciones = CajaFunctions()
        articulos_stock = ArticuloStock()
        socio_funciones = SocioFunctions()
        # se busca la venta por id
        venta = Venta.objects.get(pk=self.kwargs['pk'])
        if venta.venta_sin_ganancia: # en caso de ser verdadero solo se resta sin ganancia
            caja_funciones.restar_sin_ganancia(venta.precio_venta_total, self.request.session.get('id_sucursal'))
        else: # en caso de ser falso, se verifica la forma de pago
            # de acuerdo a la forma de pago se resta en la caja el monto
            if len(venta.forma_pago.split('-')) > 1:
                if venta.forma_pago.split('-')[1] == 'Canje de Puntos':
                    caja_funciones.restar_ventas_socios(venta.precio_venta_total,
                                                        self.request.session['id_sucursal']) # resta en la caja el ingreso
                    socio_funciones.sumar_puntos(venta.socio.id, venta.puntos) # suma de nuevo los puntos a los socios
            if venta.forma_pago == 'efectivo':
                caja_funciones.restar_venta_efectivo(venta.precio_venta_total, self.request.session['id_sucursal'])
            if venta.forma_pago == 'descuento':
                caja_funciones.restar_venta_efectivo(venta.precio_venta_total, self.request.session['id_sucursal'])
            if venta.forma_pago == 'credito':
                aumentar_precio = float(venta.precio_venta_total) * int(venta.porcentaje_aumento)
                precio_enviar = float(venta.precio_venta_total) + (float(aumentar_precio)/100)
                caja_funciones.restar_venta_credito(precio_enviar, self.request.session['id_sucursal'])
            if venta.forma_pago == 'debito':
                caja_funciones.restar_venta_debito(venta.precio_venta_total, self.request.session['id_sucursal'])

        for articulo_venta in venta.articulo_venta.all():
            articulos_stock.sumar_stock(articulo_venta.articulo.id,
                                        articulo_venta.cantidad)
            articulos_stock.restar_vendida(articulo_venta.articulo.id,
                                           articulo_venta.cantidad)
        venta.fecha_baja = datetime.datetime.now().date()
        venta.causa_baja = 'Sin especificar'
        venta.baja = True
        venta.save()
        messages.error(request, 'El árticulo fue eliminado '
                                'de forma correcta')
        return HttpResponseRedirect(self.success_url)


class VentaReportListView(ListView):

    queryset = Venta.objects.filter(fecha_no_time__month=datetime.datetime.now().month, baja=False).order_by('-fecha')
    template_name = 'ventas/venta_report_list.html'

    def get_queryset(self):
        if 'texto_buscar' in self.request.GET:
            # en caso de filtrar por fechas, tambien se agrega la sucursal
            # si el admin desea ver otra sucursal, debe acceder
            fecha_desde = self.request.GET.get('texto_buscar').split(' - ')[0]
            fecha_hasta = self.request.GET.get('texto_buscar').split(' - ')[1]
            queryset = Venta.objects.filter(
                fecha_no_time__gte=
                fecha_desde.split('/')[2] + '-' + fecha_desde.split('/')[1] +
                '-' + fecha_desde.split('/')[0],
                fecha_no_time__lte=
                fecha_hasta.split('/')[2] + '-' + fecha_hasta.split('/')[1] +
                '-' + fecha_hasta.split('/')[0], baja=False, sucursal__id=self.request.session.get('id_sucursal')
            ).order_by('-fecha')
            if fecha_desde == fecha_hasta:
                # si las fechas son iguales no las compara, solo buscar esa fecha
                # y tambien lo hace por sucursal
                queryset = Venta.objects.filter(
                    fecha_no_time=fecha_desde.split('/')[2] + '-' +
                    fecha_desde.split('/')[1] + '-' + fecha_desde.split('/')[0],
                    baja=False, sucursal__id=self.request.session.get('id_sucursal')).order_by('-fecha')
        else:
            # se filtra por mes actual y la sucursal , al mismo tiempo
            # se ordena por fecha de forma descendente
            queryset = Venta.objects.filter(
                fecha_no_time__month=datetime.datetime.now().month,
                sucursal__id=self.request.session.get('id_sucursal'), baja=False).order_by('-fecha')
        return queryset


class VentaReportLineListView(ListView):

    queryset = Caja.objects.filter(fecha__year=datetime.datetime.now().year).order_by('-fecha')
    template_name = 'ventas/venta_report_line.html'

    def get_context_data(self, **kwargs):
        context = super(VentaReportLineListView, self).get_context_data(**kwargs)
        cajas = Caja.objects.filter(fecha__year=datetime.datetime.now().year, sucursal__id=
                                    self.request.session.get('id_sucursal'))
        caja_enviar = []
        for caja in cajas:
            if caja.ventas_efectivo:
                a = {
                    'sucursal': caja.sucursal,
                    'ventas': caja.ventas_efectivo,
                    'fecha': str(caja.fecha).split('-')[2] + '/' + str(caja.fecha).split('-')[1] + '/' + str(caja.fecha).split('-')[0]
                }
                caja_enviar.append(a)
        context['cajas'] = caja_enviar
        return context

    def get_queryset(self):
        if 'texto_buscar' in self.request.GET:
            fecha_desde = self.request.GET.get('texto_buscar').split(' - ')[0]
            fecha_hasta = self.request.GET.get('texto_buscar').split(' - ')[1]
            caja_enviar = []

            cajas = Caja.objects.filter(
                fecha__gte=
                fecha_desde.split('/')[2] + '-' + fecha_desde.split('/')[1] +
                '-' + fecha_desde.split('/')[0],
                fecha__lte=
                fecha_hasta.split('/')[2] + '-' + fecha_hasta.split('/')[1] +
                '-' + fecha_hasta.split('/')[0], sucursal__id=
                self.request.session.get('id_sucursal')
            ).order_by('fecha')
            for caja in cajas:
                if caja.ventas_efectivo:
                    a = {
                        'sucursal': caja.sucursal,
                        'ventas': caja.ventas_efectivo,
                        'fecha': str(caja.fecha).split('-')[2] + '/' + str(caja.fecha).split('-')[1] + '/' + str(caja.fecha).split('-')[0]
                    }
                    caja_enviar.append(a)
            queryset = caja_enviar

        else:
            cajas = Caja.objects.filter(fecha__year=datetime.datetime.now().year, sucursal__id=
                                    self.request.session.get('id_sucursal')).order_by('fecha')
            caja_enviar = []
            for caja in cajas:
                if caja.ventas_efectivo:
                    a = {
                        'sucursal': caja.sucursal,
                        'ventas': caja.ventas_efectivo,
                        'fecha': str(caja.fecha).split('-')[2] + '/' + str(caja.fecha).split('-')[1] + '/' + str(caja.fecha).split('-')[0]
                    }
                    caja_enviar.append(a)
            queryset = caja_enviar
        return queryset
