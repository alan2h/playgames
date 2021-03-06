
import datetime

from django.views.generic import (ListView, CreateView,
                                  UpdateView, DeleteView)
from django.contrib.messages.views import SuccessMessageMixin
from django.contrib import messages
from django.core.paginator import Paginator
from django.shortcuts import render

from .models import Gasto, Motivo # los motivos son obligaciones de cada sucursal a pagar
from .forms import GastoForm

from apps.lib.cajas.gestion import CajaFunctions
from apps.sucursales.models import Sucursal


class GastoListView(ListView):

    queryset = Gasto.objects.all()
    template_name = 'gastos/gasto_list.html'

    def get_queryset(self):
        queryset = Gasto.objects.filter(fecha=datetime.datetime.now(),
                                        sucursal__id=self.request.session.get('id_sucursal'))
        return queryset


class GastoCreateView(SuccessMessageMixin, CreateView):

    model = Gasto
    form_class = GastoForm
    template_name = 'gastos/gasto_form.html'
    success_url = '/gastos/alta/'
    success_message = 'El gasto se registro de forma correcta'


    def get_context_data(self, **kwargs):
        context = super(GastoCreateView, self).get_context_data(**kwargs)
        gastos = Paginator(Gasto.objects.filter(sucursal__id=self.request.session['id_sucursal']).order_by('-fecha'), 10)
        page = gastos.page(1)
        context['gastos'] = page
       
        return context

    def get(self, request, *args, **kwargs):

        gastos = Paginator(Gasto.objects.filter(sucursal__id=self.request.session['id_sucursal']).order_by('-fecha'), 10)
        if 'page' in self.request.GET:
            page = gastos.page(self.request.GET.get('page'))
        else:
            page = gastos.page(1)
        # filtro motivos de gastos por sucursales 
        # luego se realiza una comparativa, si este ya fue pagado, lo marcara de la lista
        motivos = Motivo.objects.filter(sucursal__id=self.request.session.get('id_sucursal'))
        motivo_enviar = []
        i = 0
        for motivo in motivos:
            gasto = Gasto.objects.filter(fecha__month=datetime.datetime.now().month, motivo=motivo.descripcion)
            if gasto.exists():
                motivo_enviar.append('%s, pagado este mes -0ee4ed' % motivo.descripcion)
            else:
                motivo_enviar.append('%s -FFF' % motivo.descripcion)
        gastos = page
        form = GastoForm
        return render(request, self.template_name, {'form': form, 'gastos': gastos, 'motivos': motivo_enviar})
        
    
    def form_valid(self, form):
        if form.is_valid():
            form.cleaned_data['sucursal'] = self.request.session['id_sucursal']
            caja_funciones = CajaFunctions()
            caja_funciones.sumar_gasto(form.data['monto'], self.request.session['id_sucursal'])
            sucursal = Sucursal.objects.get(pk=self.request.session['id_sucursal'])
            form.instance.sucursal = sucursal
        return super(GastoCreateView, self).form_valid(form)


class GastoUpdateView(SuccessMessageMixin, UpdateView):

    model = Gasto
    form_class = GastoForm
    success_url = '/gastos/listado/'
    template_name = 'gastos/gasto_form.html'
    success_message = 'El gasto se modifico de forma correcta'

    def form_valid(self, form):
        if form.is_valid():
            caja_funciones = CajaFunctions()
            gasto = Gasto.objects.get(pk=self.kwargs['pk']).monto
            caja_funciones.restar_gasto(gasto, self.request.session['id_sucursal'])
            caja_funciones.sumar_gasto(form.data['monto'], self.request.session['id_sucursal'])
            sucursal = Sucursal.objects.get(pk=self.request.session['id_sucursal'])
            form.instance.sucursal = sucursal
        return super(GastoUpdateView, self).form_valid(form)

    def get(self, request, *args, **kwargs):

        gastos = Paginator(Gasto.objects.filter(sucursal__id=self.request.session['id_sucursal']).order_by('-fecha'), 10)
        if 'page' in self.request.GET:
            page = gastos.page(self.request.GET.get('page'))
        else:
            page = gastos.page(1)

        # filtro motivos de gastos por sucursales 
        # luego se realiza una comparativa, si este ya fue pagado, lo marcara de la lista
        motivos = Motivo.objects.filter(sucursal__id=self.request.session.get('id_sucursal'))
        motivo_enviar = []
        i = 0
        for motivo in motivos:
            gasto = Gasto.objects.filter(fecha__month=datetime.datetime.now().month, motivo=motivo.descripcion)
            if gasto.exists():
                motivo_enviar.append('%s, pagado este mes -0ee4ed' % motivo.descripcion)
            else:
                motivo_enviar.append('%s -FFF' % motivo.descripcion)
        gastos = page
        form = GastoForm(instance=Gasto.objects.get(pk=self.kwargs.get('pk')))
        return render(request, self.template_name, {'form': form, 'gastos': gastos, 'motivos': motivo_enviar})

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


class GastoReporte(ListView):

    model = Gasto
    template_name = 'gastos/gasto_reporte.html'
    paginate_by = 20

    def get_queryset(self):
        '''
        En caso de venir el parametro texto_buscar
        se filtran las fechas,
        caso contrario, se envia el mes en curso
        '''
        if 'texto_buscar' in self.request.GET:
            fecha_desde = self.request.GET.get('texto_buscar').split(' - ')[0]
            fecha_hasta = self.request.GET.get('texto_buscar').split(' - ')[1]
            queryset = Gasto.objects.filter(
                fecha__gte=
                fecha_desde.split('/')[2] + '-' + fecha_desde.split('/')[1] +
                '-' + fecha_desde.split('/')[0],
                fecha__lte=
                fecha_hasta.split('/')[2] + '-' + fecha_hasta.split('/')[1] +
                '-' + fecha_hasta.split('/')[0],
                sucursal=self.request.session.get('id_sucursal')
            ).order_by('fecha')
        else:
            queryset = Gasto.objects.filter(fecha__month=datetime.datetime.now().month, 
                sucursal__id=self.request.session.get('id_sucursal')).order_by('-fecha')
            
        return queryset