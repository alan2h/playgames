
from datetime import datetime, timedelta, time

from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate, logout, login
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.views.generic import TemplateView

from apps.cajas.models import Caja

from apps.lib.cajas.gestion import CajaCreateIfNoExist


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


def salir(request):

    logout(request)
    return HttpResponseRedirect('/')
