from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, TemplateView
from django.contrib.messages.views import SuccessMessageMixin
from django.contrib import messages

from .models import Cliente, Contacto, Cuota
from .forms import ClienteForm, ContactoForm, CuotaForm

from apps.sucursales.models import Sucursal
from apps.ventas.models import Venta


class ClienteTemplateView(ListView):

    template_name = 'clientes/clientes_list.html'
    queryset = Cliente.objects.filter(baja=False)

    def get_queryset(self):
        queryset = super(ClienteTemplateView, self).get_queryset()
        queryset = Cliente.objects.filter(sucursal__id=
                                          self.request.session.get('id_sucursal')) # Filtrar solo los socios de la sucursal
        return queryset


class ClienteCreateView(SuccessMessageMixin, CreateView):

    model = Cliente
    form_class = ClienteForm
    template_name = 'clientes/cliente_form.html'
    success_message = 'El cliente se registro con éxito'
    success_url = '/clientes/alta'

    def form_valid(self, form):
        sucursal = Sucursal.objects.get(id=self.request.session.get('id_sucursal'))
        form.instance.sucursal = sucursal
        return super(ClienteCreateView, self).form_valid(form)

    def get_success_url(self):
        return '/clientes/contactos/alta/' + str(self.object.pk)


class ContactoCreateView(SuccessMessageMixin, CreateView):

    model = Contacto
    form_class = ContactoForm
    template_name = 'clientes/contacto_form.html'
    success_url = '/clientes/contacto/alta/'
    success_message = 'El contacto del cliente se ha registrado'

    def get_context_data(self, **kwargs):
        context = super(ContactoCreateView, self).get_context_data(**kwargs)

        cliente = Cliente.objects.get(pk=self.kwargs['pk'])
        context['nombre'] = cliente.nombre

        context['pk'] = self.kwargs['pk']
        contactos = Contacto.objects.filter(cliente__id=self.kwargs['pk'],
                                            baja=False)
        context['contactos'] = contactos
        return context

    def post(self, request, *args, **kwargs):

        contacto_form = ContactoForm(data=self.request.POST)
        contacto_form.data['cliente'] = self.kwargs['pk']
        if contacto_form.is_valid():
            contacto_form.save()
            messages.success(request, 'El contacto se agrego con éxito')
            return HttpResponseRedirect('/clientes/contactos/alta/%s' %
                                        self.kwargs['pk'])
        else:
            messages.error(request, 'Existen errores en el formulario')
            return render(request, 'contacto_form.html', {
                'form': contacto_form, 'pk': self.kwargs['pk']})

    def form_valid(self, form):
        return super(ContactoCreateView, self).form_valid(form)


class ContactoUpdateView(SuccessMessageMixin, UpdateView):

    model = Contacto
    form_class = ContactoForm
    success_url = '/clientes/alta/'
    template_name = 'clientes/contacto_form.html'
    success_message = 'El cliente se modifico con éxito'

    def get_context_data(self, **kwargs):
        context = super(ContactoUpdateView, self).get_context_data(**kwargs)
        # print(self.kwargs['p'])
        context['pk'] = self.kwargs['p']

        cliente = Cliente.objects.get(pk=self.kwargs['p'])
        context['cliente'] = cliente.nombre

        contactos = Contacto.objects.filter(cliente__id=self.kwargs['p'],
                                            baja=False)
        context['contactos'] = contactos
        return context

    def post(self, request, *args, **kwargs):
        contacto = Contacto.objects.get(pk=self.kwargs['pk'])
        cliente = Cliente.objects.get(pk=self.kwargs['p'])
        object_list = Contacto.objects.filter(cliente__id=cliente.pk,
                                              baja=False)
        cliente_form = ContactoForm(data=self.request.POST, instance=contacto)
        cliente_form.data['cliente'] = cliente.pk
        if cliente_form.is_valid():
            cliente_form.save()
            messages.success(request, 'El contacto se modifico con éxito')
            return HttpResponseRedirect('/clientes/contactos/alta/%s' %
                                        self.kwargs['p'])
        else:
            messages.error(request, 'Existen errores en el formulario')
            return render(request, 'contacto_form.html',
                          {
                              'form': cliente_form,
                              'p': self.kwargs['pk'],
                              'pk': self.kwargs['p'],
                              'contactos': object_list
                          })


class ClienteUpdateView(SuccessMessageMixin, UpdateView):

    model = Cliente
    form_class = ClienteForm
    template_name = 'clientes/cliente_form.html'
    success_url = '/clientes/listado/'
    success_message = 'EL cliente se modifico con éxito'

    def get_context_data(self, **kwargs):
        context = super(ClienteUpdateView, self).get_context_data(**kwargs)
        return context

    def form_valid(self, form):
        sucursal = Sucursal.objects.get(id=self.request.session.get('id_sucursal'))
        form.instance.sucursal = sucursal
        return super(ClienteUpdateView, self).form_valid(form)

    '''def get_success_url(self):
        return '/clientes/modi/%s' % str(self.form_class.id)'''


class ClienteDeleteView(DeleteView):

    model = Cliente
    template_name = 'clientes/cliente_confirm_delete.html'
    success_url = '/clientes/listado/'

    def delete(self, request, *args, **kwargs):

        messages.error(request, 'El cliente se elimino correctamente')
        return super(ClienteDeleteView, self).delete(request, *args, **kwargs)


class ContactoDeleteView(DeleteView):

    model = Contacto
    template_name = 'clientes/contacto_confirm_delete.html'
    success_url = '/clientes/listado/'

    def delete(self, request, *args, **kwargs):

        messages.error(request, 'El contacto se elimino correctamente')
        return super(ContactoDeleteView, self).delete(request, *args, **kwargs)


class ClienteDetailView(TemplateView):

    template_name = 'clientes/historial_cliente_venta.html'

    def get_context_data(self, **kwargs):
        context = super(ClienteDetailView, self).get_context_data(**kwargs)
        cliente = Cliente.objects.get(pk=self.kwargs['pk'])
        context['cliente'] = cliente

        venta = Venta.objects.filter(socio__id=self.kwargs['pk'],
                                            baja=False)
        context['ventas'] = venta
        return context


class CuotaCreate(SuccessMessageMixin, CreateView):

    form_class = CuotaForm
    template_name = 'clientes/cuota_form.html'
    model = Cuota
    success_message = 'La cuota se registro con éxito'

    def form_valid(self, form):

        return super(CuotaCreate, self).form_valid(form)
