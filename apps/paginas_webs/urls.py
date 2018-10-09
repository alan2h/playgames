
from django.conf.urls import url, include

from .views import SlidesCreateView


urlpatterns = [
   # Urls comunes
   url(r'^alta/$', SlidesCreateView.as_view(), name='slides-alta'),
]
