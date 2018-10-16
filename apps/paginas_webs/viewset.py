from rest_framework.pagination import PageNumberPagination
from rest_framework.viewsets import ModelViewSet

from .models import Slides
from .serializer import SlideSerializer


# -------- api para la pagina web ------- #


class SlidesViewSet(ModelViewSet):

    queryset = Slides.objects.all()
    serializer_class = SlideSerializer
