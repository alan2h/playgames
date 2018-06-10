
import datetime

from django.views.generic import CreateView, UpdateView, DeleteView
from django.core.paginator import Paginator
from django.shortcuts import render
from django.contrib.messages.views import SuccessMessageMixin
from django.contrib import messages

from .models import GastoMensual, Motivo
from .forms import GastoMensualForm

from apps.sucursales.models import Sucursal


class GastoMensualCreateView(CreateView):

    form_class = GastoMensualForm
    model = GastoMensual
    template_name = 'gastos_mensuales/gasto_mensual_form.html'
    success_url = '/gastos/mes/alta'

    def get_context_data(self, **kwargs):
        context = super(GastoMensualCreateView, self).get_context_data(**kwargs)
        gastos = Paginator(GastoMensual.objects.filter(sucursal__id=self.request.session['id_sucursal']).order_by('-fecha'), 10)
        page = gastos.page(1)
        context['gastos'] = page
       
        return context

    def get(self, request, *args, **kwargs):
    
        gastos = Paginator(GastoMensual.objects.filter(sucursal__id=self.request.session['id_sucursal']).order_by('-fecha'), 10)
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
            gasto = GastoMensual.objects.filter(fecha__month=datetime.datetime.now().month, 
                                                motivo=motivo.descripcion,
                                                sucursal__id=self.request.session.get('id_sucursal'))
            if gasto.exists():
                motivo_enviar.append('%s, pagado este mes -0ee4ed' % motivo.descripcion)
            else:
                motivo_enviar.append('%s -FFF' % motivo.descripcion)
        gastos = page
        form = GastoMensualForm
        return render(request, self.template_name, {'form': form, 'gastos': gastos, 'motivos': motivo_enviar})


    def form_valid(self, form):
        
        if form.is_valid():
            form.cleaned_data['sucursal'] = self.request.session['id_sucursal']
            
            sucursal = Sucursal.objects.get(pk=self.request.session['id_sucursal'])
            form.instance.sucursal = sucursal
        return super(GastoMensualCreateView, self).form_valid(form)


class GastoMensualUpdateView(SuccessMessageMixin, UpdateView):
    
    model = GastoMensual
    form_class = GastoMensualForm
    success_url = '/gastos/mes/alta/'
    template_name = 'gastos_mensuales/gasto_mensual_form.html'
    success_message = 'El gasto se modifico de forma correcta'

    def form_valid(self, form):
        if form.is_valid():
            
            sucursal = Sucursal.objects.get(pk=self.request.session['id_sucursal'])
            form.instance.sucursal = sucursal
        return super(GastoMensualUpdateView, self).form_valid(form)

    def get(self, request, *args, **kwargs):

        gastos = Paginator(GastoMensual.objects.filter(sucursal__id=self.request.session['id_sucursal']).order_by('-fecha'), 10)
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
            gasto = GastoMensual.objects.filter(fecha__month=datetime.datetime.now().month, 
                                                motivo=motivo.descripcion, 
                                                sucursal__id=self.request.session.get('id_sucursal'))
            if gasto.exists():
                motivo_enviar.append('%s, pagado este mes -0ee4ed' % motivo.descripcion)
            else:
                motivo_enviar.append('%s -FFF' % motivo.descripcion)
        gastos = page
        form = GastoMensualForm(instance=GastoMensual.objects.get(pk=self.kwargs.get('pk')))
        return render(request, self.template_name, {'form': form, 'gastos': gastos, 'motivos': motivo_enviar})

    def get_success_url(self):
        return '/gastos/mes/editar/%s' % str(self.object.pk)


class GastoMensualDeleteView(DeleteView):
    
    model = GastoMensual
    template_name = 'gastos_mensuales/gasto_mensual_confirm_delete.html'
    success_url = '/gastos/mes/alta/'

    def delete(self, request, *args, **kwargs):
        
        messages.error(request, 'El gasto se elimino correctamente')
        return super(GastoMensualDeleteView, self).delete(request, *args, **kwargs)