# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2018-05-28 00:45
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ventas', '0009_auto_20180527_2137'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='venta',
            name='stock_actual',
        ),
    ]