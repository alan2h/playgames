"""sigdrugstore URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static

from . import views

urlpatterns = [
    url(r'^admin/', admin.site.urls),

    # arhivo de ingreso de sesión en rest framework
    url(r'^api-auth/', include('rest_framework.urls',
                               namespace='rest_framework')),

    url(r'^$', views.ingresar, name='login'),
    url(r'^seleccion/sucursal/$', views.seleccion_sucursal, name='seleccion-sucursal'),
    url(r'^salir/$', views.salir, name='logout'),
    url(r'^dashboard/$', views.DashBoardTemplateView.as_view(),
        name='dashboard'),
    url(r'^articulos/', include('apps.articulos.urls'),
        name='articulos'),
    url(r'^proveedores/', include('apps.proveedores.urls'),
        name='proveedores'),
    url(r'^compras/', include('apps.compras.urls'),
        name='compras'),
    url(r'^clientes/', include('apps.clientes.urls'),
        name='clientes'),
    url(r'^ventas/', include('apps.ventas.urls'),
        name='ventas'),
    url(r'^cajas/', include('apps.cajas.urls'),
        name='cajas'),
    url(r'^gastos/', include('apps.gastos.urls'),
        name='gastos'),
    url(r'^ingresos/', include('apps.otros_ingresos.urls'),
        name='gastos'),
    url(r'^perfiles/', include('apps.perfiles.urls'),
        name='perfiles'),
    url(r'^sucursales/', include('apps.sucursales.urls'),
        name='sucursales'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
