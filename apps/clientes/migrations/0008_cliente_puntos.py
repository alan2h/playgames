# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2018-04-19 19:24
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clientes', '0007_cliente_numero_documento'),
    ]

    operations = [
        migrations.AddField(
            model_name='cliente',
            name='puntos',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
