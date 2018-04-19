
import datetime

from rest_framework import serializers

from .models import Cliente


class ClienteSerializer(serializers.ModelSerializer):


   class Meta:
       model = Cliente
       fields = ('id', 'nombre', 'apellido', 'direccion', 'baja', 'fecha_baja',
                 'causa_baja', 'numero_documento', 'puntos')
