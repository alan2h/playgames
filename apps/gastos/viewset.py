import datetime
from django.http import JsonResponse

from rest_framework.viewsets import ModelViewSet
from rest_framework import serializers

from .models import Gasto
from .serializer import GastoSerializer


class GastoViewSet(ModelViewSet):

    queryset = Gasto.objects.filter(fecha=datetime.datetime.now())
    serializer_class = GastoSerializer


def MotivoViewSet(request):

    data = {
        'agua': 'Agua',
        'luz': 'Luz',
        'mantenimiento': 'mantenimiento',
        'varios': 'Varios'
    }

    return JsonResponse(data)
