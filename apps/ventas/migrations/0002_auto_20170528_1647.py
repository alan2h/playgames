# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-05-28 19:47
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ventas', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='venta',
            name='forma_pago',
            field=models.CharField(blank=True, max_length=400, null=True),
        ),
        migrations.AddField(
            model_name='venta',
            name='porcentaje_aumento',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
