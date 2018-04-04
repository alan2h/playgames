
from django.conf.urls import url

from .views import (VentaCreateView, TicketDetailView,
                    VentaListView, VentaDeleteView, VentaReportListView,
                    VentaReportPieListView)
from . import helpers

urlpatterns = [
    # Ventas
    url(r'^alta/$', VentaCreateView.as_view(), name='ventas-alta'),
    url(r'^informe/$', VentaListView.as_view(), name='ventas-reporte'),
    url(r'^informe/texto/$', VentaReportListView.as_view(),
        name='ventas-reporte-texto'),
    url(r'^informe/pie/$', VentaReportPieListView.as_view(),
        name='ventas-reporte-pie'),
    url(r'^eliminar/(?P<pk>(\d+))$', VentaDeleteView.as_view(),
        name='venta-delete'),
    url(r'^ticket/(?P<pk>(\d+))$', TicketDetailView.as_view(),
        name='ticket-alta'),
    # Ajax
    url(r'^ajax/ventas/alta/$', helpers.ajax_guardar_venta,
        name='ventas-ajax-alta'),
    url(r'^ajax/codigo/articulo/$', helpers.ajax_get_articulo_unico,
        name='ventas-ajax-articulos'),
]
