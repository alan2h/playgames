
from django.conf.urls import url, include

from .views import GastoMensualCreateView, GastoMensualUpdateView, GastoMensualDeleteView

urlpatterns = [
    url(r'^alta/', GastoMensualCreateView.as_view(), name='cajas-alta'),
    url(r'^editar/(?P<pk>(\d+))$', GastoMensualUpdateView.as_view()),
    url(r'^eliminar/(?P<pk>(\d+))$', GastoMensualDeleteView.as_view()),
]
