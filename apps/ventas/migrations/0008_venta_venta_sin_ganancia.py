# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2018-05-27 16:20
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ventas', '0007_venta_sucursal'),
    ]

    operations = [
        migrations.AddField(
            model_name='venta',
            name='venta_sin_ganancia',
            field=models.BooleanField(default=False),
        ),
    ]
