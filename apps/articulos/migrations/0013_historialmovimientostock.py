# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2019-02-18 13:08
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('articulos', '0012_articulo_stock_web'),
    ]

    operations = [
        migrations.CreateModel(
            name='HistorialMovimientoStock',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('movimiento', models.CharField(blank=True, max_length=3000, null=True)),
                ('articulo', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='articulos.Articulo')),
                ('usuario', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Historial de movimiento de stock',
                'verbose_name_plural': 'Historial de movimientos de stock',
            },
        ),
    ]
