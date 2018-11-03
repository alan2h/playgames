
import datetime

from rest_framework import serializers

from .models import Cliente, TipoCliente


class TipoClienteSerializer(serializers.ModelSerializer):

    class Meta:
        model = TipoCliente
        fields = ('id', 'descripcion')


class ClienteSerializer(serializers.ModelSerializer):

    tipo_cliente = TipoClienteSerializer()

    class Meta:
        model = Cliente
        fields = ('id', 'nombre', 'tipo_cliente' ,'apellido', 'direccion', 'baja', 'fecha_baja',
                  'causa_baja', 'numero_documento', 'puntos', 'credito', 'puntos_premium')
