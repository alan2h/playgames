# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2018-04-17 19:35
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clientes', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='cliente',
            name='fecha_nacimiento',
            field=models.DateField(blank=True, null=True),
        ),
    ]
