# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2018-05-28 00:37
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ventas', '0008_venta_venta_sin_ganancia'),
    ]

    operations = [
        migrations.AddField(
            model_name='venta',
            name='stock_actual',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='venta',
            name='usuario',
            field=models.CharField(blank=True, max_length=900, null=True),
        ),
    ]
