
import datetime

from django.contrib.messages.views import SuccessMessageMixin
from django.contrib import messages
from django.views.generic import CreateView, ListView, UpdateView, DeleteView

from apps.lib.cajas.gestion import CajaFunctions
from apps.sucursales.models import Sucursal

from .models import OtroIngreso
from .forms import OtroIngresoForm


class OtroIngresoListView(ListView):

    queryset = OtroIngreso.objects.filter(fecha=datetime.datetime.now())
    template_name = 'otros_ingresos/otro_ingreso_list.html'

    def get_queryset(self):
        queryset = OtroIngreso.objects.filter(fecha=datetime.datetime.now(), 
                                              sucursal__id=self.request.session.get('id_sucursal'))
        return queryset


class OtroIngresoCreateView(SuccessMessageMixin, CreateView):

    model = OtroIngreso
    form_class = OtroIngresoForm
    success_url = '/ingresos/alta/'
    template_name = 'otros_ingresos/otro_ingreso_form.html'
    success_message = 'El ingreso se registro de forma correcta'

    def form_valid(self, form):
        if form.is_valid():
            # Se guarda la sucursal a la que pertenece
            sucursal = Sucursal.objects.get(pk=self.request.session.get('id_sucursal'))
            form.instance.sucursal = sucursal
            # Se guarda a caja el ingreso
            caja_funciones = CajaFunctions()
            caja_funciones.sumar_ingreso(form.data['monto'], self.request.session['id_sucursal'])
        return super(OtroIngresoCreateView, self).form_valid(form)


class OtroIngresoUpdateView(SuccessMessageMixin, UpdateView):

    model = OtroIngreso
    form_class = OtroIngresoForm
    success_url = '/ingresos/listado/'
    template_name = 'otros_ingresos/otro_ingreso_form.html'
    success_message = 'El ingreso se modifico de forma correcta'

    def form_valid(self, form):
        if form.is_valid():
            # Se modifica la sucursal a la que pertenece 
            sucursal = Sucursal.objects.get(pk=self.request.session.get('id_sucursal'))
            form.instance.sucursal = sucursal
            # Se guarda a caja el ingreso 
            caja_funciones = CajaFunctions()
            otro_ingreso = OtroIngreso.objects.get(pk=self.kwargs['pk']).monto
            caja_funciones.restar_ingreso(otro_ingreso, self.request.session['id_sucursal'])
            caja_funciones.sumar_ingreso(form.data['monto'], self.request.session['id_sucursal'])
        return super(OtroIngresoUpdateView, self).form_valid(form)

    def get_success_url(self):
        return '/ingresos/editar/%s' % str(self.object.pk)


class OtroIngresoDeleteView(DeleteView):

    model = OtroIngreso
    template_name = 'otros_ingresos/otro_ingreso_confirm_delete.html'
    success_url = '/ingresos/listado/'

    def delete(self, request, *args, **kwargs):
        messages.error(request, 'El gasto se elimino correctamente')
        caja_funciones = CajaFunctions()
        caja_funciones.restar_ingreso(self.get_object().monto, self.request.session['id_sucursal'])
        return super(OtroIngresoDeleteView, self).delete(request, *args, **kwargs)


class OtroIngresoReportList(ListView):

    queryset = OtroIngreso.objects.all()
    template_name = 'otros_ingresos/otro_ingreso_report.html'

    def get_queryset(self):
        queryset = OtroIngreso.objects.filter(fecha__month=datetime.datetime.now().month, 
                                              sucursal__id=self.request.session.get('id_sucursal'))
        '''
        En caso de venir el parametro texto_buscar
        se filtran las fechas,
        caso contrario, se envia el mes en curso
        '''
        if 'texto_buscar' in self.request.GET:
            fecha_desde = self.request.GET.get('texto_buscar').split(' - ')[0]
            fecha_hasta = self.request.GET.get('texto_buscar').split(' - ')[1]
            queryset = OtroIngreso.objects.filter(
                fecha__gte=
                fecha_desde.split('/')[2] + '-' + fecha_desde.split('/')[1] +
                '-' + fecha_desde.split('/')[0],
                fecha__lte=
                fecha_hasta.split('/')[2] + '-' + fecha_hasta.split('/')[1] +
                '-' + fecha_hasta.split('/')[0],
                sucursal=self.request.session.get('id_sucursal')
            ).order_by('fecha')
        return queryset
