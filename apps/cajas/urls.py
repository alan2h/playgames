
from django.conf.urls import url, include

from .views import (CajaCreateView, CajaUpdateView, CajaListView,
                    CajaReportListView)

urlpatterns = [
    url(r'^alta/', CajaCreateView.as_view(), name='cajas-alta'),
    url(r'^listado/', CajaListView.as_view(), name='cajas-listado'),
    url(r'^informe/texto/', CajaReportListView.as_view(), name='cajas-resporte'),
    url(r'^editar/(?P<pk>(\d+))$', CajaUpdateView.as_view(),
        name='cajas-edit'),
]
