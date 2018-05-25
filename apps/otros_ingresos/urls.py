
from django.conf.urls import url, include

from .views import (OtroIngresoListView, OtroIngresoUpdateView,
                    OtroIngresoCreateView, OtroIngresoDeleteView, OtroIngresoReportList)


urlpatterns = [
    url(r'^listado/', OtroIngresoListView.as_view()),
    url(r'^reporte/', OtroIngresoReportList.as_view()),
    url(r'^alta/', OtroIngresoCreateView.as_view()),
    url(r'^editar/(?P<pk>(\d+))$', OtroIngresoUpdateView.as_view()),
    url(r'^eliminar/(?P<pk>(\d+))$', OtroIngresoDeleteView.as_view()),
]
