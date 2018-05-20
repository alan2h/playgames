
import datetime

from django.views.generic import (ListView, CreateView,
                                  UpdateView, DeleteView)
from django.contrib.messages.views import SuccessMessageMixin
from django.contrib import messages
from django.core.paginator import Paginator
from django.shortcuts import render

from .models import Gasto
from .forms import GastoForm

from apps.lib.cajas.gestion import CajaFunctions


class GastoListView(ListView):

    queryset = Gasto.objects.filter(fecha=datetime.datetime.now())
    template_name = 'gastos/gasto_list.html'


class GastoCreateView(SuccessMessageMixin, CreateView):

    model = Gasto
    form_class = GastoForm
    template_name = 'gastos/gasto_form.html'
    success_url = '/gastos/alta/'
    success_message = 'El gasto se registro de forma correcta'
    

    def get_context_data(self, **kwargs):
        context = super(GastoCreateView, self).get_context_data(**kwargs)
        gastos = Paginator(Gasto.objects.all().order_by('-fecha'), 10)
        page = gastos.page(1)
        context['gastos'] = page
        return context

    def get(self, request, *args, **kwargs):

        gastos = Paginator(Gasto.objects.all().order_by('-fecha'), 10)
        if 'page' in self.request.GET:
            page = gastos.page(self.request.GET.get('page'))
        else:
            page = gastos.page(1)
        gastos = page
        form = GastoForm
        return render(request, self.template_name, {'form': form, 'gastos': gastos})
        
    

    def form_valid(self, form):
        if form.is_valid():
            form.cleaned_data['sucursal'] = self.request.session['id_sucursal']
            caja_funciones = CajaFunctions()
            caja_funciones.sumar_gasto(form.data['monto'], self.request.session['id_sucursal'])
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
            caja_funciones.restar_gasto(gasto, self.request.session['id_sucursal'])
            caja_funciones.sumar_gasto(form.data['monto'], self.request.session['id_sucursal'])
        return super(GastoUpdateView, self).form_valid(form)

    def get_success_url(self):
        return '/gastos/editar/%s' % str(self.object.pk)


class GastoDeleteView(DeleteView):

    model = Gasto
    template_name = 'gastos/gasto_confirm_delete.html'
    success_url = '/gastos/listado/'

    def delete(self, request, *args, **kwargs):
        caja_funciones = CajaFunctions()
        caja_funciones.restar_gasto(self.get_object().monto, self.request.session['id_sucursal'])
        messages.error(request, 'El gasto se elimino correctamente')
        return super(GastoDeleteView, self).delete(request, *args, **kwargs)
