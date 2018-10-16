
from django.conf.urls import url, include
from rest_framework import routers

from .views import SlidesCreateView

from .viewset import SlidesViewSet

router = routers.DefaultRouter()
router.register(r'slides', SlidesViewSet)

urlpatterns = [
   # Api rest
   url(r'^api/', include(router.urls)),
   # Urls comunes
   url(r'^alta/$', SlidesCreateView.as_view(), name='slides-alta'),
]
