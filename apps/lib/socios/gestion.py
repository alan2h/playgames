from apps.clientes.models import Cliente


class SocioFunctions(object):
    ''' gestiona puntos y creditos del socio '''

    def restar_puntos(self, id, puntos):
        cliente = Cliente.objects.get(pk=id)
        cliente.puntos = int(cliente.puntos) - int(puntos)
        cliente.save()
        return cliente

    def sumar_puntos(self, id, puntos):
        cliente = Cliente.objects.get(pk=id)
        cliente.puntos = int(cliente.puntos) + int(puntos)
        cliente.save()
        return cliente

    def restar_credito(self, id, credito):
        cliente = Cliente.objects.get(pk=id)
        cliente.credito = float(cliente.credito) - float(credito)
        cliente.save()
        return cliente
