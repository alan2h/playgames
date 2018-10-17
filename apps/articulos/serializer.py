
from .models import Articulo, Marca, Rubro, Categoria

from rest_framework import serializers


class MarcaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Marca
        fields = (
            'id',
            'descripcion'
        )


class CategoriaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Categoria
        fields = (
            'id',
            'descripcion',
            'imagen'
        )


class RubroSerializer(serializers.ModelSerializer):

    class Meta:
        model = Rubro
        fields = (
            'id',
            'descripcion'
        )


class ArticuloSerializer(serializers.ModelSerializer):

    marca = MarcaSerializer()
    rubro = RubroSerializer()

    class Meta:
        model = Articulo
        fields = (
            'id',
            'codigo_barra',
            'nombre',
            'descripcion',
            'marca',
            'rubro',
            'precio_venta',
            'precio_credito',
            'precio_debito',
            'precio_compra',
            'precio_web',
            'stock',
            'stock_minimo',
            'imagen',
            'impuesto_interno',
            'alicuota_iva',
            'fecha_compra',
            'fecha_modificacion',
            'baja',
            'fecha_baja',
            'causa_baja',
            'no_suma_caja',
            'cantidad_vendida'
        )
