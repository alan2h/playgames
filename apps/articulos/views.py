
import datetime

from django.http import HttpResponseRedirect, HttpResponse
from django.views.generic import (CreateView, ListView, UpdateView, View,
                                  DetailView, TemplateView)
from django.contrib import messages
from django.contrib.messages.views import SuccessMessageMixin
from django.shortcuts import render

from .models import Articulo, HistorialPreciosCompra, HistorialPreciosVenta, Categoria, Rubro
from .forms import ArticuloForm, ArticuloDeleteForm, MarcaForm, RubroForm, \
    ActualizacionPrecioForm, CategoriaForm

from .helpers import DibujarBarcode
from . import helpers


class ArticuloCreateView(SuccessMessageMixin, CreateView):

    model = Articulo
    form_class = ArticuloForm
    success_url = '/articulos/alta'
    success_message = 'El Árticulo fue creado con éxito'

    def get_context_data(self, **kwargs):
        context = super(ArticuloCreateView, self).get_context_data(**kwargs)
        context['marca_form'] = MarcaForm
        context['rubro_form'] = RubroForm
        context['categoria_form'] = CategoriaForm
        context['categorias'] = Categoria.objects.all()
        return context

    def form_valid(self, form):
        return super(ArticuloCreateView, self).form_valid(form)

    def form_invalid(self, form):
        messages.error(self.request, 'El formulario contiene errores')
        return super(ArticuloCreateView, self).form_invalid(form)

    def get_success_url(self):
        return self.success_url


class ArticuloListView(ListView):

    queryset = Articulo.objects.filter(baja=False)
    paginate_by = 6

    def get_queryset(self):
        qs = Articulo.objects.filter(baja=False)
        if 'texto_buscar' in self.request.GET:
            if self.request.GET.get('texto_buscar') is not '':
                texto_buscar = self.request.GET.get('texto_buscar')
                qs = helpers.buscar_codigo(texto_buscar)
                qs = helpers.buscar_descripcion(qs, texto_buscar)
                qs = helpers.buscar_precio_venta(qs, texto_buscar)
                qs = helpers.buscar_precio_compra(qs, texto_buscar)
                qs = helpers.buscar_stock(qs, texto_buscar)
                qs = helpers.buscar_stock_minimo(qs, texto_buscar)
                qs = helpers.buscar_fecha_compra(qs, texto_buscar)
                qs = helpers.buscar_nombre(qs, texto_buscar)
        return qs


class ArticuloUpdateView(SuccessMessageMixin, UpdateView):

    model = Articulo
    form_class = ArticuloForm
    success_url = '/articulos/listado/'
    success_message = 'El Árticulo se modifico con éxito'

    def get_context_data(self, **kwargs):
        context = super(ArticuloUpdateView, self).get_context_data(**kwargs)
        print(self.kwargs['pk'])
        articulo = Articulo.objects.get(pk=self.kwargs['pk'])
        print(articulo)
        categoria_modificar = Categoria.objects.get(pk=articulo.rubro.categoria.id)
        print(categoria_modificar)
        context['marca_form'] = MarcaForm
        context['rubro_form'] = RubroForm
        context['categoria_form'] = CategoriaForm
        context['categorias'] = Categoria.objects.all()
        context['categoria_modificar'] = categoria_modificar.id
        return context

    def form_valid(self, form):
        articulo = Articulo.objects.get(pk=self.kwargs['pk'])
        historial_precio_venta = HistorialPreciosVenta(articulo=articulo,
                                                       fecha_modificacion=datetime.datetime.now(),
                                                       precio=
                                                       form.data['precio_venta'])
        historial_precio_venta.save()
        historial_precio_compra = HistorialPreciosCompra(articulo=articulo,
                                                         fecha_modificacion=datetime.datetime.now(),
                                                         precio=
                                                         form.data[
                                                           'precio_compra'])

        historial_precio_compra.save()
        return super(ArticuloUpdateView, self).form_valid(form)


class ArticuloDeleteView(View):

    def get(self, request, *args, **kwargs):

        articulo_delete_form = ArticuloDeleteForm()
        object = Articulo.objects.get(pk=self.kwargs['pk'])
        return render(self.request, 'articulos/articulo_confirm_delete.html',
                      {'form': articulo_delete_form,
                       'articulo': object})

    def post(self, request, *args, **kwargs):

        articulo = Articulo.objects.get(pk=self.kwargs['pk'])
        articulo_delete_form = ArticuloDeleteForm(instance=articulo,
                                                  data=self.request.POST)
        if articulo_delete_form.is_valid():
            articulo_delete_form.instance.fecha_baja = \
                datetime.datetime.now().date()
            articulo_delete_form.instance.baja = True
            articulo_delete_form.save()
            messages.error(request, 'El árticulo fue eliminado '
                                    'de forma correcta')
            return HttpResponseRedirect('/articulos/listado/')


class ArticuloDetailView(DetailView):

    model = Articulo
    template_name = 'articulos/articulo_detail.html'


def barcode(request, pk):

    articulo = Articulo.objects.get(pk=pk)
    d = DibujarBarcode(articulo.codigo_barra)
    binaryStuff = d.asString('gif')
    return HttpResponse(binaryStuff, 'image/gif')


class ActualizarPrecioTemplateView(TemplateView):

    template_name = 'articulos/articulo_actualizar_precios.html'

    def get_context_data(self, **kwargs):
        context = super(ActualizarPrecioTemplateView, self)\
            .get_context_data(**kwargs)
        context['form'] = ActualizacionPrecioForm()
        return context

    def post(self, request, *args,  **kwargs):
        busqueda = {}
        form_articulo_actualizar = ActualizacionPrecioForm(data=
                                                           self.request.POST)
        if form_articulo_actualizar.is_valid():
            if 'rubro' in form_articulo_actualizar.data:
                if form_articulo_actualizar.data['rubro'] != '':
                    busqueda['rubro__id'] = form_articulo_actualizar.data['rubro']
            if 'marca' in form_articulo_actualizar.data:
                if form_articulo_actualizar.data['marca'] != '':
                    busqueda['marca__id'] = form_articulo_actualizar.data['marca']
            if 'codigo_desde' in form_articulo_actualizar.data:
                if form_articulo_actualizar.data['codigo_desde'] != '':
                    busqueda['codigo_barra__lte'] = \
                        form_articulo_actualizar.data['codigo_desde']
            if 'codigo_hasta' in form_articulo_actualizar.data:
                if form_articulo_actualizar.data['codigo_hasta'] != '':
                    busqueda['codigo_barra__gte'] = \
                        form_articulo_actualizar.data['codigo_hasta']
            articulos = Articulo.objects.filter(**busqueda)

            if 'variacion' in form_articulo_actualizar.data:
                if form_articulo_actualizar.data['variacion'] == 'costo':

                    if 'moneda' in form_articulo_actualizar.data:
                        if form_articulo_actualizar.data['moneda'] == 'pesos':
                            for articulo in articulos:
                                resultado = str(int(articulo.precio_compra) +
                                                int(form_articulo_actualizar.
                                                    data['numero']))

                                historial_precio_compra = HistorialPreciosCompra(
                                    articulo=articulo,
                                    fecha_modificacion=datetime.datetime.now(),
                                    precio=articulo.precio_compra)
                                historial_precio_compra.save()

                                articulo.precio_compra = resultado
                                articulo.save()
                        else:

                            for articulo in articulos:
                                aumento = (int(articulo.precio_compra) *
                                                int(form_articulo_actualizar.
                                                    data['numero']))/100
                                resultado = int(articulo.precio_compra) +\
                                            int(aumento)

                                historial_precio_compra = HistorialPreciosCompra(
                                    articulo=articulo,
                                    fecha_modificacion=datetime.datetime.now(),
                                    precio=articulo.precio_compra)
                                historial_precio_compra.save()

                                articulo.precio_compra = resultado
                                articulo.save()

                else:
                    if 'moneda' in form_articulo_actualizar.data:
                        if form_articulo_actualizar.data['moneda'] == 'pesos':

                            for articulo in articulos:
                                resultado = str(int(articulo.precio_venta) + \
                                                int(form_articulo_actualizar.data[
                                                        'numero']))

                                historial_precio_venta = HistorialPreciosVenta(
                                    articulo=articulo,
                                    fecha_modificacion=datetime.datetime.now(),
                                    precio=articulo.precio_venta)
                                historial_precio_venta.save()

                                articulo.precio_venta = resultado
                                articulo.save()
                        else:
                            for articulo in articulos:
                                aumento = (int(articulo.precio_venta) *
                                           int(form_articulo_actualizar.
                                               data['numero'])) / 100
                                resultado = int(articulo.precio_venta) + \
                                            int(aumento)

                                historial_precio_venta = HistorialPreciosVenta(
                                    articulo=articulo,
                                    fecha_modificacion=datetime.datetime.now(),
                                    precio=articulo.precio_venta)
                                historial_precio_venta.save()

                                articulo.precio_venta = resultado
                                articulo.save()

            messages.success(self.request, 'El precio del Árticuo se '
                                           'actualizo')
            return HttpResponseRedirect('/articulos/actualizar/precios/')
        else:
            return render(self.request,
                          'articulos/articulo_actualizar_precios.html',
                          {'form': form_articulo_actualizar})


class HistorialPreciosVentaListView(ListView):

    model = HistorialPreciosVenta
    template_name = 'articulos/historial_precio_venta.html'
    paginate_by = 20


class HistorialPreciosCompraListView(ListView):

    model = HistorialPreciosCompra
    template_name = 'articulos/historial_precio_compra.html'
    paginate_by = 20
