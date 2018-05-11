
from django.conf.urls import url, include

from .views import CambiarSucursalTemplateView



urlpatterns = [
   # Urls comunes
   url(r'^cambiar/$', CambiarSucursalTemplateView.as_view(), name='cambiar-sucursal')
]
