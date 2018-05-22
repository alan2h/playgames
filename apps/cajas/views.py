
import datetime

from django.contrib.messages.views import SuccessMessageMixin
from django.http import HttpResponseRedirect
from django.views.generic import CreateView, UpdateView, ListView

from .models import Caja
from .forms import CajaForm

from apps.lib.cajas import gestion


class CajaCreateView(SuccessMessageMixin, CreateView):

    model = Caja
    form_class = CajaForm
    success_url = '/cajas/alta/'
    success_message = 'La caja se registro con éxito'

    def dispatch(self, request, *args, **kwargs):
        caja_actual = gestion.CajaFunctions()
        if caja_actual.exists(self.request.session['id_sucursal']):
            return HttpResponseRedirect('/cajas/editar/%s' %
                                        caja_actual.first_field_pk(self.request.session['id_sucursal']))
        return super(CajaCreateView, self).dispatch(request,*args, **kwargs)

    def form_valid(self, form):
        return super(CajaCreateView, self).form_valid(form)


class CajaUpdateView(SuccessMessageMixin, UpdateView):

    model = Caja
    form_class = CajaForm
    success_url = '/cajas/alta/'
    success_message = 'La caja se registro con éxito'

    def dispatch(self, request, *args, **kwargs):
        return super(CajaUpdateView, self).dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        return super(CajaUpdateView, self).form_valid(form)


class CajaListView(ListView):

    model = Caja
    template_name = 'cajas/caja_list.html'

    def get_context_data(self, **kwargs):
        context = super(CajaListView, self).get_context_data(**kwargs)
        today = datetime.datetime.now()
        context['object_list'] = Caja.objects.filter(fecha=today)
        return context


class CajaReportListView(ListView):

    queryset = Caja.objects.filter(fecha__month=datetime.datetime.now().month).order_by('-fecha')
    template_name = 'cajas/caja_reporte_list.html'

    def get_context_data(self, **kwargs):
        context = super(CajaReportListView, self).get_context_data(**kwargs)
        return context

    def get_queryset(self):
        if 'texto_buscar' in self.request.GET:
            fecha_desde = self.request.GET.get('texto_buscar').split(' - ')[0]
            fecha_hasta = self.request.GET.get('texto_buscar').split(' - ')[1]
            queryset = Caja.objects.filter(
                fecha__gte=
                fecha_desde.split('/')[2] + '-' + fecha_desde.split('/')[1] +
                '-' + fecha_desde.split('/')[0],
                fecha__lte=
                fecha_hasta.split('/')[2] + '-' + fecha_hasta.split('/')[1] +
                '-' + fecha_hasta.split('/')[0]
            ).order_by('fecha')
        else:
            queryset = super(CajaReportListView, self).get_queryset()
        return queryset
