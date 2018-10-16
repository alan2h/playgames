
from .models import Slides

from rest_framework import serializers


class SlideSerializer(serializers.ModelSerializer):

    class Meta:
        model = Slides
        fields = (
            'id',
            'imagen'
        )
