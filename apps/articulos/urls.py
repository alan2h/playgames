
from django.conf.urls import url, include
from rest_framework import routers

from .views import ArticuloCreateView, ArticuloListView, ArticuloUpdateView, \
    ArticuloDeleteView, ArticuloDetailView, ActualizarPrecioTemplateView, \
    HistorialPreciosVentaListView, HistorialPreciosCompraListView, \
    ArticuloListPrint, ActualizarPrecioCreditoView

from .viewset import (ArticuloViewSet, RubroViewSet, CategoriaViewSet,
                      ArticuloMasVendidoWebViewSet, ArticuloWebList,
                      ArticuloStockWeb)

from . import helpers
from . import views

router = routers.DefaultRouter()
router.register(r'articulos', ArticuloViewSet)
router.register(r'rubros', RubroViewSet)
router.register(r'categorias', CategoriaViewSet)
router.register(r'articulos-vendidos-web', ArticuloMasVendidoWebViewSet)
router.register(r'articulosweblist', ArticuloWebList)
router.register(r'articulostockweb', ArticuloStockWeb)


urlpatterns = [
   # Api rest
   url(r'^api/', include(router.urls)),
   # Urls comunes
   url(r'^alta/$', ArticuloCreateView.as_view(), name='articulos-alta'),
   url(r'^listado/$', ArticuloListView.as_view(), name='articulos-listado'),
   url(r'^listado/print/$', ArticuloListPrint.as_view(),
       name='articulos-listado-print'),
   url(r'^barcode/(?P<pk>(\d+))$', views.barcode, name='articulos-barcode'),
   url(r'^historial/venta/$', HistorialPreciosVentaListView.as_view(),
       name='historial-precios-venta'),
   url(r'^historial/compra/$', HistorialPreciosCompraListView.as_view(),
       name='historial-precios-compra'),
   url(r'^editar/(?P<pk>(\d+))$', ArticuloUpdateView.as_view(),
       name='articulos-edit'),
   url(r'^detalle/(?P<pk>(\d+))$', ArticuloDetailView.as_view(),
       name='articulos-detail'),
   url(r'^eliminar/(?P<pk>(\d+))$', ArticuloDeleteView.as_view(),
       name='articulos-delete'),
   url(r'^ajax/marca/alta/$', helpers.ajax_create_marca,
       name='marca-alta-ajax'),
   url(r'^ajax/rubro/alta/$', helpers.ajax_create_rubro,
       name='rubro-alta-ajax'),
   url(r'^ajax/categoria/alta/$', helpers.ajax_create_categoria,
       name='categoria-alta-ajax'),
   url(r'^ajax/categoria/subcategoria/$', helpers.ajax_query_rubro,
       name='categoria-query-ajax'),

   # ajax para modificar desde la lista
   url(r'^ajax/precio/credito/actualizar/$', helpers.ajax_precio_credito_update,
       name='precio-credito-actualizar-ajax'),
   url(r'^ajax/stock/actualizar/$', helpers.ajax_stock_update,
       name='stock-actualizar-ajax'),
   url(r'^ajax/stock/web/actualizar/$', helpers.ajax_stock_web_update,
       name='stock-web-actualizar-ajax'),

   url(r'^actualizar/precios/$',
       ActualizarPrecioTemplateView.as_view(), name='actualizar-precios'),
   url(r'^actualizar/creditos/$',
       ActualizarPrecioCreditoView.as_view(), name='actualizar-creditos'),
   url(r'^ajax/cambiar/sucursal/$', helpers.ajax_cambiar_sucursal,
       name='cambiar-sucursal-ajax')
]
