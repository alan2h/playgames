from django import template

register = template.Library()

@register.filter
def dividirMotivo(value):
    """splitear y devolver el primer elemento """
    return value.split('-')[0]

@register.filter
def dividirClase(value):
    """splitear y devolver el segundo elemento """
    return value.split('-')[1]

@register.filter
def dividirMotivoEnviar(value):
    """splitear y devolver el elemento  para enviar """
    if '-' in value: 
        value = value.split('-')[0]
        if ',' in value:
            value = value.split(',')[0]
    return value