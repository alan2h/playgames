
from django.conf.urls import url, include

from rest_framework import routers

from .viewset import ClienteViewSet, ClienteListViewSet
from .views import (ClienteTemplateView, ClienteCreateView, ContactoCreateView,
                    ContactoUpdateView, ClienteUpdateView, ClienteDeleteView,
                    ContactoDeleteView, ClienteDetailView)

router = routers.DefaultRouter()
router.register(r'clientes', ClienteViewSet)
router.register(r'paginado', ClienteListViewSet)


urlpatterns = [
    # Clientes
    url(r'^api/', include(router.urls)),
    url(r'^listado/', ClienteTemplateView.as_view(), name='clientes-listado'),
    url(r'^alta/', ClienteCreateView.as_view(), name='clientes-alta'),
    url(r'^editar/(?P<pk>(\d+))$', ClienteUpdateView.as_view(),
        name='clientes-edit'),
    url(r'^eliminar/(?P<pk>(\d+))$', ClienteDeleteView.as_view(),
       name='clientes-delete'),
    url(r'^detail/(?P<pk>(\d+))$', ClienteDetailView.as_view(), name='cliente-detalle'),
    # Contactos
    url(r'^contactos/editar/(?P<pk>(\d+))/(?P<p>(\d+))$',
        ContactoUpdateView.as_view(), name='contactos-edit'),
    url(r'^contactos/alta/(?P<pk>(\d+))$', ContactoCreateView.as_view(),
        name='contactos-alta'),
    url(r'^contactos/eliminar/(?P<pk>(\d+))$',
        ContactoDeleteView.as_view(), name='contactos-delete'),
]
