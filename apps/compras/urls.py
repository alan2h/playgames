
from django.conf.urls import url

from .views import CompraCreateView, CompraListView, CompraDeleteView
from . import helpers

urlpatterns = [
    # Compras
    url(r'^alta/$', CompraCreateView.as_view(), name='compras-alta'),
    url(r'^listado/$', CompraListView.as_view(), name='compras-listado'),
    url(r'^eliminar/(?P<pk>(\d+))$', CompraDeleteView.as_view(),
        name='compras-eliminar'),
    # Ajax
    url(r'^ajax/compras/alta/$', helpers.ajax_guardar_compra, name='compras-ajax-alta'),
]
