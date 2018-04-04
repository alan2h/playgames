
import datetime

from django.contrib.messages.views import SuccessMessageMixin
from django.contrib import messages
from django.http import HttpResponseRedirect
from django.views.generic import CreateView, ListView, DeleteView

from apps.articulos.models import Articulo

from .models import Compra
from .forms import CompraForm

from apps.lib.cajas.gestion import CajaCreateIfNoExist, CajaFunctions
from apps.lib.articulos.gestion_stock import ArticuloStock


class CompraCreateView(CajaCreateIfNoExist, SuccessMessageMixin, CreateView):

    model = Compra
    form_class = CompraForm
    success_url = '/compra/alta/'
    success_message = 'La compra se realizo con éxito'

    def form_valid(self, form):
        return super(CompraCreateView, self).form_valid(form)

    def get_context_data(self, **kwargs):
        context = super(CompraCreateView, self).get_context_data(**kwargs)
        articulos = Articulo.objects.filter(baja=False)
        context['articulos'] = articulos
        return context


class CompraListView(ListView):

    queryset = Compra.objects.filter(fecha=datetime.datetime.now(), baja=False)
    template_name = 'compras/compra_list.html'
    paginate_by = 5

    def get_context_data(self, **kwargs):
        context = super(CompraListView, self).get_context_data(**kwargs)
        return context


class CompraDeleteView(DeleteView):

    model = Compra
    template_name = 'compras/compra_confirm_delete.html'
    success_url = '/compras/listado/'

    def delete(self, request, *args, **kwargs):

        caja_funciones = CajaFunctions()
        articulo_stock = ArticuloStock()

        compra = Compra.objects.get(pk=self.kwargs['pk'])

        caja_funciones.restar_compra(compra.precio_compra_total)
        for articulo_compra in compra.articulo_compra.all():
            articulo_stock.restar_stock(articulo_compra.articulo.id,
                                        articulo_compra.cantidad)

        compra.fecha_baja = datetime.datetime.now().date()
        compra.causa_baja = 'Sin especificar'
        compra.baja = True
        compra.save()
        messages.error(request, 'La compra fue anulada '
                                'de forma correcta')
        return HttpResponseRedirect('/compras/listado/')
