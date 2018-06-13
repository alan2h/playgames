# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2018-06-13 22:44
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('sucursales', '0001_initial'),
        ('clientes', '0008_cliente_puntos'),
    ]

    operations = [
        migrations.AddField(
            model_name='cliente',
            name='sucursal',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='sucursales.Sucursal'),
        ),
    ]