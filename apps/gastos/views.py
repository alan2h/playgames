
import datetime

from django.views.generic import (ListView, CreateView,
                                  UpdateView, DeleteView)
from django.contrib.messages.views import SuccessMessageMixin
from django.contrib import messages

from .models import Gasto
from .forms import GastoForm

from apps.lib.cajas.gestion import CajaFunctions


class GastoListView(ListView):

    queryset = Gasto.objects.filter(fecha=datetime.datetime.now())
    template_name = 'gastos/gasto_list.html'


class GastoCreateView(SuccessMessageMixin, CreateView):

    model = Gasto
    form_class = GastoForm
    success_url = '/gastos/alta/'
    success_message = 'El gasto se registro de forma correcta'

    def form_valid(self, form):
        if form.is_valid():
            caja_funciones = CajaFunctions()
            caja_funciones.sumar_gasto(form.data['monto'])
        return super(GastoCreateView, self).form_valid(form)


class GastoUpdateView(SuccessMessageMixin, UpdateView):

    model = Gasto
    form_class = GastoForm
    success_url = '/gastos/listado/'
    success_message = 'El gasto se modifico de forma correcta'

    def form_valid(self, form):
        if form.is_valid():
            caja_funciones = CajaFunctions()
            gasto = Gasto.objects.get(pk=self.kwargs['pk']).monto
            caja_funciones.restar_gasto(gasto)
            caja_funciones.sumar_gasto(form.data['monto'])
        return super(GastoUpdateView, self).form_valid(form)

    def get_success_url(self):
        return '/gastos/editar/%s' % str(self.object.pk)


class GastoDeleteView(DeleteView):

    model = Gasto
    template_name = 'gastos/gasto_confirm_delete.html'
    success_url = '/gastos/listado/'

    def delete(self, request, *args, **kwargs):
        caja_funciones = CajaFunctions()
        caja_funciones.restar_gasto(self.get_object().monto)
        messages.error(request, 'El gasto se elimino correctamente')
        return super(GastoDeleteView, self).delete(request, *args, **kwargs)
