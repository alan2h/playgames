# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2018-06-09 18:11
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='GastoMensual',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha', models.DateField(auto_now_add=True)),
                ('motivo', models.CharField(blank=True, max_length=3000, null=True)),
                ('monto', models.DecimalField(blank=True, decimal_places=2, max_digits=12, null=True)),
            ],
            options={
                'verbose_name': 'Gasto Mensual',
                'verbose_name_plural': 'Gastos Mensuales',
            },
        ),
        migrations.CreateModel(
            name='Motivo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('descripcion', models.CharField(blank=True, max_length=3000, null=True)),
            ],
            options={
                'verbose_name': 'Motivo',
                'verbose_name_plural': 'Motivos',
            },
        ),
    ]
