
from django.conf.urls import url, include
from rest_framework import routers

from .views import UserCreateView


urlpatterns = [
   
   # Urls comunes
   url(r'^alta/$', UserCreateView.as_view(), name='perfiles-alta'),
]
