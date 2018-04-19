
from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination

from .models import Cliente
from .serializer import ClienteSerializer


class ClienteViewSet(viewsets.ModelViewSet):

    queryset = Cliente.objects.filter(baja=False)
    serializer_class = ClienteSerializer


class ClientePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 1000


class ClienteListViewSet(viewsets.ModelViewSet):

    queryset = Cliente.objects.filter(baja=False)
    serializer_class = ClienteSerializer
    pagination_class = ClientePagination


    def get_queryset(self):

        queryset = Cliente.objects.filter(baja=False)
        descripcion = self.request.query_params.get('descripcion', None)
        if descripcion is not None:
            queryset = Cliente.objects.filter(nombre__icontains=
                                               descripcion, baja=False)
            if queryset.exists() is False:
                queryset = Cliente.objects.filter(apellido__icontains=
                                                   descripcion, baja=False)
                if queryset.exists() is False:
                    queryset = Cliente.objects.filter(
                        numero_documento__icontains=descripcion,
                        baja=False
                    )
                    
        return queryset