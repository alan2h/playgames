from django.shortcuts import render
from django.http import HttpResponseRedirect    

from .models import Sucursal


from django.views.generic import TemplateView


class CambiarSucursalTemplateView(TemplateView):

        template_name = 'sucursales/sucursal_form.html'

        def get_context_data(self, **kwargs):
            context = super(CambiarSucursalTemplateView, self).get_context_data(**kwargs)
            context['sucursales'] = Sucursal.objects.all()
            return context

        def post(self, request, *args, **kwargs):
            self.request.session['id_sucursal'] = self.request.POST.get('sucursal')
            return HttpResponseRedirect('/dashboard/')