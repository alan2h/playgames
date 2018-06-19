# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2018-06-18 04:17
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('clientes', '0010_auto_20180614_1642'),
        ('ventas', '0013_auto_20180530_1539'),
    ]

    operations = [
        migrations.AddField(
            model_name='venta',
            name='socio',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='clientes.Cliente'),
        ),
    ]