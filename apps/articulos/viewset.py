from rest_framework.pagination import PageNumberPagination
from rest_framework.viewsets import ModelViewSet

from .models import Articulo
from .serializer import ArticuloSerializer


class ArticuloPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 1000


class ArticuloViewSet(ModelViewSet):

    queryset = Articulo.objects.filter(baja=False)
    serializer_class = ArticuloSerializer
    pagination_class = ArticuloPagination

    def get_queryset(self):

        queryset = Articulo.objects.filter(baja=False)
        descripcion = self.request.query_params.get('descripcion', None)
        if descripcion is not None:
            queryset = Articulo.objects.filter(descripcion__icontains=
                                               descripcion, baja=False)
            if queryset.exists() is False:
                queryset = Articulo.objects.filter(codigo_barra__icontains=
                                                   descripcion, baja=False)
                if queryset.exists() is False:
                    queryset = Articulo.objects.filter(
                        rubro__descripcion__icontains=descripcion,
                        baja=False
                    )
                    if queryset.exists() is False:
                        queryset = Articulo.objects.filter(
                            marca__descripcion__icontains=descripcion,
                            baja=False
                        )
        return queryset
