# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-05-14 16:51
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('articulos', '0001_initial'),
        ('proveedores', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='ArticuloCompra',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cantidad', models.IntegerField()),
                ('precio_compra', models.DecimalField(decimal_places=2, max_digits=12)),
                ('articulo', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='articulos.Articulo')),
                ('proveedor', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='proveedores.Proveedor')),
            ],
            options={
                'verbose_name': 'Árticulo y compra',
                'verbose_name_plural': 'Árticulos y Compras',
            },
        ),
        migrations.CreateModel(
            name='Compra',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha', models.DateTimeField(auto_now_add=True)),
                ('codigo_comprobante', models.CharField(blank=True, max_length=800, null=True)),
                ('precio_compra_total', models.DecimalField(decimal_places=2, max_digits=12)),
                ('articulo_compra', models.ManyToManyField(to='compras.ArticuloCompra')),
            ],
            options={
                'verbose_name': 'Compra',
                'verbose_name_plural': 'Compras',
            },
        ),
    ]
