
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
from apps.perfiles.models import Perfil

import time 


def ingresar(request):

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
                            perfil = Perfil.objects.filter(usuario__id=request.user.id)[0]
                            request.session['id_sucursal'] = perfil.sucursal.id
                            request.session['nombre_sucursal'] = Sucursal.objects.get(pk=perfil.sucursal.id).descripcion
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


class DashBoardTemplateView(TemplateView):

    template_name = 'dashboard.html'

    def dispatch(self, request, *args, **kwargs):
        if 'id_sucursal' not in self.request.session:
            logout(request)
            return HttpResponseRedirect('/')
        id_sucursal = self.request.session['id_sucursal']
        sucursal = Sucursal.objects.get(pk=id_sucursal)
        
        today = datetime.now().date()
        caja = Caja.objects.filter(fecha=today, sucursal__id=id_sucursal)
        if caja.exists() is False:
            caja = Caja(fecha=today, caja_inicial=0, sucursal=sucursal)
            caja.save()
       
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
