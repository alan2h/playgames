# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2018-04-24 20:28
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ventas', '0005_venta_fecha_no_time'),
    ]

    operations = [
        migrations.AlterField(
            model_name='venta',
            name='fecha_no_time',
            field=models.DateField(auto_now=True),
        ),
    ]
