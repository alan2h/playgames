
import datetime
import time

from django.http import HttpResponseRedirect, HttpResponse
from django.views.generic import (CreateView, ListView, UpdateView, View,
                                  DetailView, TemplateView)
from django.contrib import messages
from django.contrib.messages.views import SuccessMessageMixin
from django.contrib import messages
from django.shortcuts import render

from .models import Articulo, HistorialPreciosCompra, HistorialPreciosVenta, Categoria, Rubro, Marca, \
    HistorialMovimientoStock
from .forms import ArticuloForm, ArticuloDeleteForm, MarcaForm, RubroForm, \
    ActualizacionPrecioForm, CategoriaForm

from apps.sucursales.models import Sucursal
from apps.perfiles.models import Perfil

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
        if form.data['codigo_barra'] != '':
            if Articulo.objects.filter(
                codigo_barra=form.data['codigo_barra'],
                sucursal__id=form.data['sucursal'],
                baja=False):
                form.add_error('codigo_barra', '''Este código de barras ya existe en esa sucursal, '''
                                    '''por favor busque el árticulo, '''
                                    '''los código de barras deben ser únicos''')
                return render(self.request, 'articulos/articulo_form.html',
                        {'form': form})

        if 'alicuota_iva' in form.data:
            iva = float(form.data['alicuota_iva'])
            incremento = (float(form.data['precio_venta']) * float(iva)) / 100
            precio_credito = float(form.data['precio_venta']) + float(incremento)
            precio_debito = float(form.data['precio_venta']) + float(incremento)
            form.instance.precio_credito = precio_credito
            form.instance.precio_debito = precio_debito
        form.save(commit=True)
        messages.success(self.request, 'El Árticulo fue creado con éxito')
        return HttpResponseRedirect('/articulos/listado/')

    def form_invalid(self, form):
        messages.error(self.request, 'El formulario contiene errores')
        return super(ArticuloCreateView, self).form_invalid(form)

    def get_success_url(self):
        return self.success_url


class ArticuloListView(ListView):

    queryset = Articulo.objects.filter(baja=False)
    paginate_by = 6

    def get_context_data(self, **kwargs):
        context = super(ArticuloListView, self).get_context_data(**kwargs)
        context['categorias'] = Categoria.objects.all()
        return context

    def get_queryset(self):
        if self.request.user.is_staff:
            if self.request.GET.get('campo_categoria') == '' or self.request.GET.get('campo_categoria') is None:
                qs = Articulo.objects.filter(baja=False, sucursal=self.request.session['id_sucursal'])
            else:
                qs = Articulo.objects.filter(baja=False, rubro__categoria__id=self.request.GET.get('campo_categoria'),
                                             sucursal=self.request.session['id_sucursal'])

            if 'texto_buscar' in self.request.GET:
                if self.request.GET.get('texto_buscar') is not '':
                    texto_buscar = self.request.GET.get('texto_buscar')
                    campo_buscar = self.request.GET.get('campo_buscar')
                    sucursal_unico=self.request.session['id_sucursal']
                    qs = helpers.buscar_codigo(qs, texto_buscar, sucursal=sucursal_unico)


                    if 'campo_categoria' in self.request.GET:
                        if self.request.GET.get('campo_categoria') is not '':

                            if qs.exists() is False:
                                qs = helpers.buscar_marca_categoria(qs, texto_buscar,
                                                                    self.request.GET.get('campo_categoria'),
                                                                    sucursal=sucursal_unico)
                            if qs.exists() is False:
                                qs = helpers.buscar_rubro_categoria(qs, texto_buscar,
                                                                    self.request.GET.get('campo_categoria'),
                                                                    sucursal=sucursal_unico)
                            if qs.exists() is False:
                                qs = helpers.buscar_nombre_categoria(qs, texto_buscar,
                                                                     self.request.GET.get('campo_categoria'),
                                                                     sucursal=sucursal_unico)
                            if qs.exists() is False:
                                qs = helpers.buscar_descripcion_categoria(qs, texto_buscar,
                                                                          self.request.GET.get('campo_categoria'),
                                                                          sucursal=sucursal_unico)
                    if qs.exists() is False:
                        qs = helpers.buscar_all_campos(qs, texto_buscar, sucursal=sucursal_unico)
                    if qs.exists() is False:
                        qs = helpers.buscar_nombre_descripcion(qs, texto_buscar, texto_buscar, sucursal=sucursal_unico)
                    if qs.exists() is False:
                        qs = helpers.buscar_descripcion(qs, texto_buscar, sucursal=sucursal_unico)
                    if qs.exists() is False:
                        qs = helpers.buscar_marca(qs, texto_buscar, sucursal=sucursal_unico)
                    if qs.exists() is False:
                        qs = helpers.buscar_rubro(qs, texto_buscar, sucursal=sucursal_unico)
                    if qs.exists() is False:
                        qs = helpers.buscar_precio_venta(qs, texto_buscar, sucursal=sucursal_unico)
                    if qs.exists() is False:
                        qs = helpers.buscar_precio_compra(qs, texto_buscar, sucursal=sucursal_unico)
                    if qs.exists() is False:
                        qs = helpers.buscar_stock(qs, texto_buscar, sucursal=sucursal_unico)
                    if qs.exists() is False:
                        qs = helpers.buscar_stock_minimo(qs, texto_buscar, sucursal=sucursal_unico)
                    if qs.exists() is False:
                        qs = helpers.buscar_fecha_compra(qs, texto_buscar, sucursal=sucursal_unico)
                    if qs.exists() is False:
                        qs = helpers.buscar_nombre(qs, texto_buscar, sucursal=sucursal_unico)
                    if qs.exists() is False:
                        qs = helpers.buscar_categoria(qs, texto_buscar, sucursal=sucursal_unico)
                    # desde aqui va a ir buscando coincidencias en caso de que la busqueda sea negativa y no consiga resultados
                    # es un intento de evitar el error de tipeo del usuario
                    if qs.exists() is False:
                        qs = helpers.buscar_all_campos(qs, texto_buscar[:9], sucursal=sucursal_unico)
                    if qs.exists() is False:
                        qs = helpers.buscar_all_campos(qs, texto_buscar[:8], sucursal=sucursal_unico)
                    if qs.exists() is False:
                        qs = helpers.buscar_all_campos(qs, texto_buscar[:7], sucursal=sucursal_unico)
                    if qs.exists() is False:
                        qs = helpers.buscar_all_campos(qs, texto_buscar[:6], sucursal=sucursal_unico)
                    if qs.exists() is False:
                        qs = helpers.buscar_all_campos(qs, texto_buscar[:5], sucursal=sucursal_unico)
                    if qs.exists() is False:
                        qs = helpers.buscar_all_campos(qs, texto_buscar[:4], sucursal=sucursal_unico)
                    if qs.exists() is False:
                        qs = helpers.buscar_all_campos(qs, texto_buscar[:3], sucursal=sucursal_unico)
                    if qs.exists() is False:
                        qs = helpers.buscar_all_campos(qs, texto_buscar[:2], sucursal=sucursal_unico)
                    if qs.exists() is False:
                        qs = helpers.buscar_all_campos(qs, texto_buscar[:1], sucursal=sucursal_unico)

                    if qs.exists() is False:
                        qs = helpers.buscar_all_campos(qs, texto_buscar[7:], sucursal=sucursal_unico)
                    if qs.exists() is False:
                        qs = helpers.buscar_all_campos(qs, texto_buscar[6:], sucursal=sucursal_unico)
                    if qs.exists() is False:
                        qs = helpers.buscar_all_campos(qs, texto_buscar[5:], sucursal=sucursal_unico)
                    if qs.exists() is False:
                        qs = helpers.buscar_all_campos(qs, texto_buscar[4:], sucursal=sucursal_unico)
                    if qs.exists() is False:
                        qs = helpers.buscar_all_campos(qs, texto_buscar[3:], sucursal=sucursal_unico)
                    if qs.exists() is False:
                        qs = helpers.buscar_all_campos(qs, texto_buscar[2:], sucursal=sucursal_unico)
                    if qs.exists() is False:
                        qs = helpers.buscar_all_campos(qs, texto_buscar[1:], sucursal=sucursal_unico)
                        
            return qs
        else:
            ''' en caso de que no sea staff va a venir a crear la lista aca donde se seleeciona la sucursal '''
            sucursal_unico = '1'
            perfil = Perfil.objects.filter(usuario__id=self.request.user.id)
            if perfil.exists():
                perfil_unico = perfil[0]
                sucursal = Sucursal.objects.get(id=perfil_unico.sucursal.id)
                sucursal_unico = sucursal.id

            if self.request.GET.get('campo_categoria') == '' or self.request.GET.get('campo_categoria') == None:
                qs = Articulo.objects.filter(baja=False, sucursal=sucursal_unico)
            else:
                qs = Articulo.objects.filter(baja=False, rubro__categoria__id=self.request.GET.get('campo_categoria'),
                                             sucursal=sucursal_unico)

            if 'texto_buscar' in self.request.GET:
                if self.request.GET.get('texto_buscar') is not '':
                    texto_buscar = self.request.GET.get('texto_buscar')
                    campo_buscar = self.request.GET.get('campo_buscar')
                    qs = helpers.buscar_codigo(qs, texto_buscar, sucursal=sucursal_unico)

                    if 'campo_categoria' in self.request.GET:
                        if self.request.GET.get('campo_categoria') is not '':

                            if qs.exists() is False:
                                qs = helpers.buscar_marca_categoria(qs, texto_buscar, self.request.GET.get('campo_categoria'), sucursal=sucursal_unico)
                            if qs.exists() is False:
                                qs = helpers.buscar_rubro_categoria(qs, texto_buscar, self.request.GET.get('campo_categoria'), sucursal=sucursal_unico)
                            if qs.exists() is False:
                                qs = helpers.buscar_nombre_categoria(qs, texto_buscar, self.request.GET.get('campo_categoria'), sucursal=sucursal_unico)
                            if qs.exists() is False:
                                qs = helpers.buscar_descripcion_categoria(qs, texto_buscar, self.request.GET.get('campo_categoria'),  sucursal=sucursal_unico)

                    if qs.exists() is False:
                        qs = helpers.buscar_all_campos(qs, texto_buscar, sucursal=sucursal_unico)
                    if qs.exists() is False:
                        qs = helpers.buscar_nombre_descripcion(qs, texto_buscar, texto_buscar, sucursal=sucursal_unico)
                    if qs.exists() is False:
                        qs = helpers.buscar_descripcion(qs, texto_buscar, sucursal=sucursal_unico)
                    if qs.exists() is False:
                        qs = helpers.buscar_marca(qs, texto_buscar, sucursal=sucursal_unico)
                    if qs.exists() is False:
                        qs = helpers.buscar_rubro(qs, texto_buscar, sucursal=sucursal_unico)
                    if qs.exists() is False:
                        qs = helpers.buscar_precio_venta(qs, texto_buscar, sucursal=sucursal_unico)
                    if qs.exists() is False:
                        qs = helpers.buscar_precio_compra(qs, texto_buscar, sucursal=sucursal_unico)
                    if qs.exists() is False:
                        qs = helpers.buscar_stock(qs, texto_buscar, sucursal=sucursal_unico)
                    if qs.exists() is False:
                        qs = helpers.buscar_stock_minimo(qs, texto_buscar, sucursal=sucursal_unico)
                    if qs.exists() is False:
                        qs = helpers.buscar_fecha_compra(qs, texto_buscar, sucursal=sucursal_unico)
                    if qs.exists() is False:
                        qs = helpers.buscar_nombre(qs, texto_buscar, sucursal=sucursal_unico)
                    if qs.exists() is False:
                        qs = helpers.buscar_categoria(qs, texto_buscar, sucursal=sucursal_unico)
            return qs


class ArticuloUpdateView(SuccessMessageMixin, UpdateView):

    model = Articulo
    form_class = ArticuloForm
    success_url = '/articulos/listado/'
    success_message = 'El Árticulo se modifico con éxito'

    def get_context_data(self, **kwargs):
        context = super(ArticuloUpdateView, self).get_context_data(**kwargs)
        articulo = Articulo.objects.get(pk=self.kwargs['pk'])
        if (articulo.rubro):
            categoria_modificar = Categoria.objects.get(pk=articulo.rubro.categoria.id)
            context['categoria_modificar'] = categoria_modificar.id
        context['marca_form'] = MarcaForm
        context['rubro_form'] = RubroForm
        context['categoria_form'] = CategoriaForm
        context['categorias'] = Categoria.objects.all()
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
        form.save(commit=False)
        if 'alicuota_iva' in form.data:
            iva = float(form.data['alicuota_iva'])
            incremento = (float(form.data['precio_venta']) * float(iva)) / 100
            precio_credito = float(form.data['precio_venta']) + float(incremento)
            precio_debito = float(form.data['precio_venta']) + float(incremento)
            form.instance.precio_credito = precio_credito
            form.instance.precio_debito = precio_debito

            marca = None
            rubro = None
            marca_descripcion = ''
            rubro_descripcion = ''
            if not form.data['marca'] is '':
                marca = Marca.objects.get(pk=form.data['marca']) # obtengo la marca
                if articulo.marca:
                    marca_descripcion = articulo.marca.descripcion

            if not form.data['rubro'] is '':
                rubro = Rubro.objects.get(pk=form.data['rubro']) # obtengo el rubro
                if articulo.rubro:
                    rubro_descripcion = articulo.rubro.descripcion

            # para actualizar los articulos en todas las sucursales aplico un filtro
            # por el codigo de barras, aqui abajo el codigo
            # se filtra por el articulo y luego se actualiza todo

            articulo_actualizar = Articulo.objects.filter(codigo_barra=articulo.codigo_barra,
                                                          nombre=articulo.nombre,
                                                          descripcion=articulo.descripcion)

            if articulo.rubro  and  articulo.marca: # Filtro si existe rubro y marca

               articulo_actualizar = Articulo.objects.filter(
                                        codigo_barra=articulo.codigo_barra,
                                        nombre=articulo.nombre, descripcion=articulo.descripcion,
                                        marca__descripcion=marca_descripcion,
                                        rubro__descripcion=rubro_descripcion)

            elif articulo.rubro is None and articulo.marca: # Filtro si existe marca pero no rubro

                articulo_actualizar = Articulo.objects.filter(codigo_barra=articulo.codigo_barra,
                                        nombre=articulo.nombre,
                                        descripcion=articulo.descripcion,
                                        marca__descripcion=marca_descripcion)

            elif articulo.marca is None and articulo.rubro: # Filtro si existe rubro pero no la marca

                articulo_actualizar = Articulo.objects.filter(codigo_barra=articulo.codigo_barra,
                                        nombre=articulo.nombre,
                                        descripcion=articulo.descripcion,
                                        rubro__descripcion=rubro_descripcion)

        # aca se actualizan los campos, independientemente de la sucursal
        print('------- articulos que se van a actualizar -------')
        for a in articulo_actualizar:
            print('articulo: ', a.nombre)
            print('sucursal: ', a.sucursal.descripcion)
            print('guardar articulos modificados en el historial', a.nombre)
            historial_mov_stock = HistorialMovimientoStock(
                articulo=a,
                movimiento='Se actualizo el articulo desde el formulario stock:' + str(a.stock),
                usuario=self.request.user
            )
            historial_mov_stock.save()
        print('-------------------------------------------------')
        articulo_actualizar.update(
                    codigo_barra=form.data['codigo_barra'],
                    nombre=form.data['nombre'],
                    descripcion=form.data['descripcion'],
                    marca=marca,
                    rubro=rubro,
                    precio_venta=form.data['precio_venta'],
                    precio_debito=precio_debito,   # campos calculados
                    precio_credito=precio_credito, # campos calculados
                    precio_compra=form.data['precio_compra'],
                    stock_minimo=form.data['stock_minimo'],
                    impuesto_interno=form.data['impuesto_interno'],
                    alicuota_iva=form.data['alicuota_iva'],
                    no_suma_caja=(form.data.get('no_suma_caja') is 'on')) # si el check viene on, quedara verdadero
        form.save(commit=True)
        messages.success(self.request, 'El Árticulo se modifico con éxito')
        return HttpResponseRedirect('/articulos/listado/')

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
        print('------- articulos que se van a actualizar -------')
        print('articulo: ', articulo.nombre)
        print('sucursal: ', articulo.sucursal.descripcion)
        print('guardar articulos modificados en el historial', articulo.nombre)
        historial_mov_stock = HistorialMovimientoStock(
            articulo=articulo,
            movimiento='se elimino el articulo ->' + str(articulo.nombre),
            usuario=self.request.user
        )
        historial_mov_stock.save()
        print('-------------------------------------------------')
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

    def get_context_data(self, **kwargs):

        context = super(ArticuloDetailView, self).get_context_data(**kwargs)
        context['sucursales'] = Sucursal.objects.all()
        return context


def barcode(request, pk):

    articulo = Articulo.objects.get(pk=pk)
    d = DibujarBarcode(articulo.id)
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

    queryset = HistorialPreciosVenta.objects.all().order_by('-fecha_modificacion')
    template_name = 'articulos/historial_precio_venta.html'
    paginate_by = 20


class HistorialPreciosCompraListView(ListView):

    queryset = HistorialPreciosCompra.objects.all().order_by('-fecha_modificacion')
    template_name = 'articulos/historial_precio_compra.html'
    paginate_by = 20


class ArticuloListPrint(ListView):

    queryset = Articulo.objects.filter(baja=False).order_by('-cantidad_vendida')
    template_name = 'articulos/articulo_list_print.html'


class ActualizarPrecioCreditoView(TemplateView):

    template_name = 'articulos/articulo_actualizar_credito.html'

    def precio_credito_debito_nuevo(self, porcentaje, precio_efectivo):
        incremento = (float(precio_efectivo) * float(porcentaje))/100
        return float(precio_efectivo) + float(incremento)

    def post(self, request, *args, **kwargs):

        articulos_actualizar = Articulo.objects.filter(baja=False)
        for articulo in articulos_actualizar:
            precio_nuevo = self.precio_credito_debito_nuevo(
                request.POST.get('porcentaje_nuevo'), articulo.precio_venta
            )
            Articulo.objects.filter(pk=articulo.id).update(
                alicuota_iva=request.POST.get('porcentaje_nuevo'),
                precio_credito=precio_nuevo,
                precio_debito=precio_nuevo
            )

        return HttpResponseRedirect('/articulos/listado/')


class HistorialMovimientoStockListView(ListView):

    queryset = HistorialMovimientoStock.objects.all().order_by('-id')
    template_name = 'articulos/movimientos_articulos_historial.html'
    paginate_by = 6

    def get_context_data(self, **kwargs):
        context = super(HistorialMovimientoStockListView, self).get_context_data(**kwargs)
        context['categorias'] = Categoria.objects.all()
        return context
