
from datetime import datetime, timedelta, time

from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate, logout, login
from django.contrib.auth.decorators import login_required

from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.views.generic import TemplateView

from apps.cajas.models import Caja

from apps.lib.cajas.gestion import CajaCreateIfNoExist
from apps.articulos.models import Articulo
from apps.sucursales.models import Sucursal

import time 


def ingresar(request):
    today = datetime.now().date()
    caja = Caja.objects.filter(fecha=today)
    if caja.exists() is False:
        caja = Caja(fecha=today, caja_inicial=0)
        caja.save()
    if request.user.is_authenticated():
        return HttpResponseRedirect('/dashboard/')
    else:
        if request.method == 'POST':
            formulario = AuthenticationForm(data=request.POST)
            if formulario.is_valid():
                acceso = authenticate(username=request.POST.get('username'),
                                      password=request.POST.get('password'))
                if acceso is not None:
                    if acceso.is_active:
                        login(request, acceso)
                        if request.user.is_staff:
                            return HttpResponseRedirect('/seleccion/sucursal')
                        else:
                            return HttpResponseRedirect('/dashboard')
                    else:
                        return render(request, 'noactivo.html')
                else:
                    return render(request, 'nousuario.html')
            else:
                render(request, 'login.html', {'formulario': formulario})
        else:
            formulario = AuthenticationForm()
        return render(request, 'login.html', {'formulario': formulario})


class DashBoardTemplateView(CajaCreateIfNoExist, TemplateView):

    template_name = 'dashboard.html'

    def dispatch(self, request, *args, **kwargs):
        articulos = Articulo.objects.filter(precio_credito=None)
        # este metodo verifica que al loguearse el admin y no se haya
        # seleccionado una sucursal, que cargue la primera por default
        # -----------------------------------------------------------
        '''if self.request.user.is_staff:
            if 'id_sucursal' in self.request.session:
                sucursal = Sucursal.objects.all()
                if sucursal.exists():
                    self.request.session['id_sucursal'] = sucursal[0].id'''
        # -----------------------------------------------------------
        if articulos.exists():
            for articulo in articulos:
                iva = float(articulo.alicuota_iva)
                time.sleep(5)
                incremento = (float(articulo.precio_venta) * float(iva)) / 100
                precio_credito = float(articulo.precio_venta) + float(incremento)
                precio_debito = float(articulo.precio_venta) + float(incremento)
                articulo_create = Articulo.objects.get(pk=articulo.id)
                articulo_create.precio_credito = precio_credito
                articulo_create.precio_debito = precio_debito
                articulo_create.save()
        return super(DashBoardTemplateView, self).dispatch(request, *args, **kwargs)


def salir(request):

    logout(request)
    return HttpResponseRedirect('/')


@login_required
def seleccion_sucursal(request):
    if request.method == 'POST':
        request.session['id_sucursal'] = request.POST.get('sucursal')
        request.session['nombre_sucursal'] = Sucursal.objects.get(pk=request.POST.get('sucursal')).descripcion
        return HttpResponseRedirect('/dashboard')
    sucursales = Sucursal.objects.all()
    return render(request, 'sucursal.html', {'sucursales': sucursales})