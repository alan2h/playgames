from django import template

register = template.Library()

@register.filter
def incremento_porcentaje(value, arg):
    """calcula porcentaje de precios e incrementa el valor"""

    incremento = (float(value) * float(arg)) /100
    resultado = float(value) + incremento
    return resultado