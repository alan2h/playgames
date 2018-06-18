from apps.clientes.models import Cliente


class SocioFunctions(object):
    
    def restar_puntos(self, id, puntos):
        cliente = Cliente.objects.get(pk=id)
        cliente.puntos = int(cliente.puntos) - int(puntos)
        cliente.save()
        return cliente
