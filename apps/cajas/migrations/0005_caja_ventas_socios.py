# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2018-06-18 01:55
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cajas', '0004_caja_venta_sin_ganancia'),
    ]

    operations = [
        migrations.AddField(
            model_name='caja',
            name='ventas_socios',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=12, null=True),
        ),
    ]
