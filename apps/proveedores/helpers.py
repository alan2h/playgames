
from .models import Proveedor


def buscar_nombre(request):

    proveedor = Proveedor.objects.filter(baja=False,
                                         nombre__icontains=
                                         request.GET.get(
                                             'texto_buscar'))
    return proveedor


def buscar_direccion(proveedor, request):

    if proveedor.exists() is False:
        proveedor = Proveedor.objects.filter(baja=False,
                                             direccion__icontains=
                                             request.GET.get(
                                                 'texto_buscar'))
        return proveedor
