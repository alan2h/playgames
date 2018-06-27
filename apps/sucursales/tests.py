from django.test import TestCase

from .models import Sucursal


class SucursalModelTest(TestCase):

    def test_crear_sucursal(self):
        """ se testea la creacion de una sucursal """
        sucursal = Sucursal.objects.create(
            descripcion='FormosaTest1'
        )

        return self.assertTrue(sucursal)
