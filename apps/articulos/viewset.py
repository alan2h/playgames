from rest_framework.pagination import PageNumberPagination
from rest_framework.viewsets import ModelViewSet

from .models import Articulo
from .serializer import ArticuloSerializer

from apps.perfiles.models import Perfil


class ArticuloPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 1000


class ArticuloViewSet(ModelViewSet):

    queryset = Articulo.objects.filter(baja=False)
    serializer_class = ArticuloSerializer
    pagination_class = ArticuloPagination

    def get_queryset(self):
        id_sucursal = 0
        if self.request.user.is_staff:
            id_sucursal = self.request.session['id_sucursal']
        else:
            perfil = Perfil.objects.filter(usuario=self.request.user.id)[0]
            id_sucursal = perfil.sucursal.id
        queryset = Articulo.objects.filter(baja=False, sucursal=id_sucursal, stock__gte=1)
        descripcion = self.request.query_params.get('descripcion', None)
        if descripcion is not None:
            queryset = Articulo.objects.filter(nombre__icontains=
                                               descripcion, baja=False, sucursal=id_sucursal,
                                               stock__gte=1)
            if queryset.exists() is False:
                queryset = Articulo.objects.filter(codigo_barra__icontains=
                                                   descripcion, baja=False, sucursal=id_sucursal,
                                                   stock__gte=1)
                if queryset.exists() is False:
                    queryset = Articulo.objects.filter(
                        rubro__descripcion__icontains=descripcion,
                        baja=False,
                        sucursal=id_sucursal,
                        stock__gte=1
                    )
                    if queryset.exists() is False:
                        queryset = Articulo.objects.filter(
                            marca__descripcion__icontains=descripcion,
                            baja=False,
                            sucursal=id_sucursal,
                            stock__gte=1
                        )
                        if queryset.exists() is False:
                            queryset = Articulo.objects.filter(
                                descripcion__icontains=descripcion,
                                baja=False,
                                sucursal=id_sucursal,
                                stock__gte=1
                            )
        return queryset
