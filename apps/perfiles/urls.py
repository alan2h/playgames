
from django.conf.urls import url, include
from rest_framework import routers

from .views import UserCreateView, PerfilCreateView


urlpatterns = [
   # Urls comunes
   url(r'^alta/$', UserCreateView.as_view(), name='perfiles-alta'),
   url(r'^alta/sucursal/$', PerfilCreateView.as_view(), name='perfil-sucursal-alta')
]
