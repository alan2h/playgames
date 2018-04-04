
from django.conf.urls import url
from .views import ProveedorCreateView, ContactoCreateView, ProveedorUpdateView\
    , ProveedorDeleteView, ContactoUpdateView, ContactoDeleteView

urlpatterns = [
   # Proveedores
   url(r'^alta/$', ProveedorCreateView.as_view(), name='proveedores-alta'),
   url(r'^editar/(?P<pk>(\d+))$', ProveedorUpdateView.as_view(),
       name='proveedores-edit'),
   url(r'^eliminar/(?P<pk>(\d+))$', ProveedorDeleteView.as_view(),
       name='proveedores-eliminar'),
   # Contactos
   url(r'^contactos/editar/(?P<pk>(\d+))/(?P<p>(\d+))$',
       ContactoUpdateView.as_view(), name='contactos-edit'),
   url(r'^contactos/eliminar/(?P<pk>(\d+))/(?P<p>(\d+))$',
       ContactoDeleteView.as_view(), name='contactos-eliminar'),
   url(r'^contactos/alta/(?P<pk>(\d+))$', ContactoCreateView.as_view(),
       name='contactos-alta'),
]
