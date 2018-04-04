
import datetime

from django.contrib.messages.views import SuccessMessageMixin
from django.contrib import messages
from django.views.generic import CreateView, ListView, UpdateView, DeleteView

from apps.lib.cajas.gestion import CajaFunctions

from .models import OtroIngreso
from .forms import OtroIngresoForm


class OtroIngresoListView(ListView):

    queryset = OtroIngreso.objects.filter(fecha=datetime.datetime.now())
    template_name = 'otros_ingresos/otro_ingreso_list.html'


class OtroIngresoCreateView(SuccessMessageMixin, CreateView):

    model = OtroIngreso
    form_class = OtroIngresoForm
    success_url = '/ingresos/alta/'
    template_name = 'otros_ingresos/otro_ingreso_form.html'
    success_message = 'El ingreso se registro de forma correcta'

    def form_valid(self, form):
        if form.is_valid():
            caja_funciones = CajaFunctions()
            caja_funciones.sumar_ingreso(form.data['monto'])
        return super(OtroIngresoCreateView, self).form_valid(form)


class OtroIngresoUpdateView(SuccessMessageMixin, UpdateView):

    model = OtroIngreso
    form_class = OtroIngresoForm
    success_url = '/ingresos/listado/'
    template_name = 'otros_ingresos/otro_ingreso_form.html'
    success_message = 'El ingreso se modifico de forma correcta'

    def form_valid(self, form):
        if form.is_valid():
            caja_funciones = CajaFunctions()
            otro_ingreso = OtroIngreso.objects.get(pk=self.kwargs['pk']).monto
            caja_funciones.restar_ingreso(otro_ingreso)
            caja_funciones.sumar_ingreso(form.data['monto'])
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
        caja_funciones.restar_ingreso(self.get_object().monto)
        return super(OtroIngresoDeleteView, self).delete(request, *args, **kwargs)
