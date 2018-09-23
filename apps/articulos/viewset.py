from rest_framework.pagination import PageNumberPagination
from rest_framework.viewsets import ModelViewSet

from .models import Articulo, Rubro, Categoria
from .serializer import ArticuloSerializer, RubroSerializer, CategoriaSerializer

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


# -------- api para la pagina web ------- #

class RubroViewSet(ModelViewSet):

    queryset = Rubro.objects.all()
    serializer_class = RubroSerializer


class CategoriaViewSet(ModelViewSet):

    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


class ArticuloMasVendidoWebPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'
    max_page_size = 1000


class ArticuloMasVendidoWebViewSet(ModelViewSet):
    '''
    Descripcion: Esta api solo trae los articulos vendidos en la central
    advertencia: No se debe verificar stock con esta api. Solo devuelve una sucursal
    params: subcategoria
    '''

    queryset = Articulo.objects.filter(baja=False, rubro__categoria__descripcion='VIDEOJUEGOS', sucursal__descripcion='FORMOSA').order_by('-cantidad_vendida')
    serializer_class = ArticuloSerializer
    pagination_class = ArticuloMasVendidoWebPagination

    def get_queryset(self):

        subcategoria = self.request.query_params.get('subcategoria', None)
        queryset = Articulo.objects.filter(baja=False, rubro__categoria__descripcion=subcategoria, sucursal__descripcion='FORMOSA').order_by('-cantidad_vendida')
        return queryset


class ArticuloWebListPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 1000


class ArticuloWebList(ModelViewSet):

    '''
    Descripcion: Para gestionar las consultas de los articulos en las listas y los detalles
    Advertencia: ...
    params: realiza una busqueda por cualquier parametro
    '''

    queryset = Articulo.objects.filter(baja=False, sucursal__descripcion='FORMOSA')
    serializer_class = ArticuloSerializer
    pagination_class = ArticuloWebListPagination

    def get_queryset(self):
        queryset = Articulo.objects.filter(baja=False, sucursal__descripcion='FORMOSA').order_by('cantidad_vendida')
        texto_busqueda = self.request.query_params.get('search', None)
        if texto_busqueda:
            queryset = Articulo.objects.filter(baja=False, nombre__icontains=texto_busqueda,  sucursal__descripcion='FORMOSA').order_by('cantidad_vendida')
            
        return queryset
