
from django.conf.urls import url, include

from rest_framework import routers

from .viewset import GastoViewSet
from . import viewset
from .views import GastoListView, GastoCreateView, GastoUpdateView, \
    GastoDeleteView, GastoReporte

router = routers.DefaultRouter()
router.register(r'gastos', GastoViewSet)


urlpatterns = [
    url(r'^api/', include(router.urls)),
    url(r'^listado/', GastoListView.as_view()),
    url(r'^alta/', GastoCreateView.as_view()),
    url(r'^reporte/', GastoReporte.as_view()),
    url(r'^motivos/', viewset.MotivoViewSet),
    url(r'^editar/(?P<pk>(\d+))$', GastoUpdateView.as_view()),
    url(r'^eliminar/(?P<pk>(\d+))$', GastoDeleteView.as_view()),
]
