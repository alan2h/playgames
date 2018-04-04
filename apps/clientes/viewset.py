
from rest_framework import viewsets

from .models import Cliente
from .serializer import ClienteSerializer


class ClienteViewSet(viewsets.ModelViewSet):

    queryset = Cliente.objects.filter(baja=False)
    serializer_class = ClienteSerializer
