
import datetime

from django.core.paginator import Paginator
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.views.generic import CreateView, UpdateView, DeleteView

from django.contrib import messages
from django.contrib.messages.views import SuccessMessageMixin

from .forms import ProveedorForm, ContactoForm
from .models import Proveedor, Contacto

from . import helpers


class ProveedorCreateView(SuccessMessageMixin, CreateView):

    model = Proveedor
    form_class = ProveedorForm
    template_name = 'proveedor_form.html'
    success_message = 'El proveedor se registro con éxito'

    def get_context_data(self, **kwargs):
        context = super(ProveedorCreateView, self).get_context_data(**kwargs)
        # Enviar --> un objeto paginado
        context['proveedores'] = Proveedor.objects.filter(baja=False)
        return context

    def get(self, request, *args, **kwargs):

        # Enviar --> un objeto paginado
        proveedores_enviar = Proveedor.objects.filter(baja=False)
        form = ProveedorForm()
        return render(request, 'proveedor_form.html',
                      {
                          'form': form,
                          'proveedores': proveedores_enviar
                      })

    def form_valid(self, form):
        return super(ProveedorCreateView, self).form_valid(form)

    def get_success_url(self):
        return '/proveedores/editar/%s' % str(self.object.pk)


class ContactoCreateView(SuccessMessageMixin, CreateView):

    model = Contacto
    form_class = ContactoForm
    template_name = 'contacto_form.html'
    success_url = '/proveedores/contacto/alta/'
    success_message = 'El contacto del proveedor se ha registrado'

    def get_context_data(self, **kwargs):
        context = super(ContactoCreateView, self).get_context_data(**kwargs)

        proveedor = Proveedor.objects.get(pk=self.kwargs['pk'])
        context['nombre'] = proveedor.nombre

        context['pk'] = self.kwargs['pk']
        contactos = Contacto.objects.filter(proveedor__id=self.kwargs['pk'],
                                            baja=False)
        context['contactos'] = contactos
        return context

    def post(self, request, *args, **kwargs):

        contacto_form = ContactoForm(data=self.request.POST)
        contacto_form.data['proveedor'] = self.kwargs['pk']
        if contacto_form.is_valid():
            contacto_form.save()
            messages.success(request, 'El contacto se agrego con éxito')
            return HttpResponseRedirect('/proveedores/contactos/alta/%s' %
                                        self.kwargs['pk'])
        else:
            messages.error(request, 'Existen errores en el formulario')
            return render(request, 'contacto_form.html', {
                'form': contacto_form, 'pk': self.kwargs['pk']})

    def form_valid(self, form):
        return super(ContactoCreateView, self).form_valid(form)


class ProveedorUpdateView(SuccessMessageMixin, UpdateView):

    model = Proveedor
    form_class = ProveedorForm
    template_name = 'proveedor_form.html'
    success_url = '/proveedores/alta/'
    success_message = 'EL proveedor se modifico con éxito'

    def get_context_data(self, **kwargs):
        context = super(ProveedorUpdateView, self).get_context_data(**kwargs)
        # Enviar --> un objeto paginado
        context['proveedores'] = Proveedor.objects.filter(baja=False)
        return context

    def get(self, request, *args, **kwargs):
        # Enviar --> form de proveedores
        form = ProveedorForm(instance=Proveedor.objects.get(
            pk=self.kwargs['pk']))

        proveedores_enviar = Proveedor.objects.filter(baja=False)

        return render(request, 'proveedor_form.html',
                      {
                          'form': form,
                          'proveedores': proveedores_enviar
                      })

    def form_valid(self, form):
        return super(ProveedorUpdateView, self).form_valid(form)

    def get_success_url(self):
        return '/proveedores/modi/%s' % str(self.form_class.pk)


class ProveedorDeleteView(DeleteView):

    model = Proveedor
    template_name = 'proveedor_confirm_delete.html'
    success_url = '/proveedores/alta/'

    def delete(self, request, *args, **kwargs):
        proveedor = Proveedor.objects.get(pk=self.kwargs['pk'])
        proveedor.baja = True
        proveedor.causa_baja = 'No existe causas'
        proveedor.fecha_baja = datetime.datetime.now().date()
        proveedor.save()
        messages.error(request, 'El proveedor se elimino con éxito')
        return HttpResponseRedirect(self.success_url)


class ContactoUpdateView(SuccessMessageMixin, UpdateView):

    model = Contacto
    form_class = ContactoForm
    success_url = '/proveedores/alta/'
    template_name = 'contacto_form.html'
    success_message = 'El proveedor se modifico con éxito'

    def get_context_data(self, **kwargs):
        context = super(ContactoUpdateView, self).get_context_data(**kwargs)
        context['pk'] = self.kwargs['p']

        proveedor = Proveedor.objects.get(pk=self.kwargs['pk'])
        context['nombre'] = proveedor.nombre

        contactos = Contacto.objects.filter(proveedor__id=self.kwargs['p'],
                                            baja=False)
        context['contactos'] = contactos
        return context

    def post(self, request, *args, **kwargs):
        contacto = Contacto.objects.get(pk=self.kwargs['pk'])
        proveedor = Proveedor.objects.get(pk=self.kwargs['p'])
        object_list = Contacto.objects.filter(proveedor__id=proveedor.pk,
                                              baja=False)
        contacto_form = ContactoForm(data=self.request.POST, instance=contacto)
        contacto_form.data['proveedor'] = proveedor.pk
        if contacto_form.is_valid():
            contacto_form.save()
            messages.success(request, 'El contacto se modifico con éxito')
            return HttpResponseRedirect('/proveedores/contactos/alta/%s' %
                                        self.kwargs['p'])
        else:
            messages.error(request, 'Existen errores en el formulario')
            return render(request, 'contacto_form.html',
                          {
                              'form': contacto_form,
                              'p': self.kwargs['pk'],
                              'pk': self.kwargs['p'],
                              'contactos': object_list
                          })


class ContactoDeleteView(DeleteView):

    model = Contacto
    template_name = 'contacto_confirm_delete.html'
    success_url = '/proveedores/contactos/alta/'

    def delete(self, request, *args, **kwargs):
        contacto = Contacto.objects.get(pk=self.kwargs['pk'])
        contacto.baja = True
        contacto.causa_baja = 'Causa Generales sobre contactos'
        contacto.fecha_baja = datetime.datetime.now().date()
        contacto.save()
        messages.error(request, 'El contacto se elimino con éxito')
        return HttpResponseRedirect('/proveedores/contactos/alta/%s' %
                                    str(self.kwargs['p']))
