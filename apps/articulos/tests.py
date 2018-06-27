
import datetime

from django.test import TestCase

from .models import Articulo


class ArticuloModelTest(TestCase):

    def test_crear_articulo(self):
        """
        prueba unitaria para la creacion de un
        articulo, se comprueba los campos que son
        requeridos
        """
        articulo = Articulo.objects.create(
                nombre='Test1',
                stock=15,
                fecha_compra=datetime.datetime.now()
        )
        self.assertTrue(articulo)
