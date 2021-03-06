# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-05-15 02:30
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Caja',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha', models.DateField(auto_created=True)),
                ('caja_inicial', models.DecimalField(blank=True, decimal_places=2, default=5000, max_digits=12, null=True)),
                ('caja_actual', models.DecimalField(blank=True, decimal_places=2, max_digits=12, null=True)),
                ('compras', models.DecimalField(blank=True, decimal_places=2, max_digits=12, null=True)),
                ('ventas_efectivo', models.DecimalField(blank=True, decimal_places=2, max_digits=12, null=True)),
                ('ventas_debito', models.DecimalField(blank=True, decimal_places=2, max_digits=12, null=True)),
                ('ventas_credito', models.DecimalField(blank=True, decimal_places=2, max_digits=12, null=True)),
                ('retiros', models.DecimalField(blank=True, decimal_places=2, max_digits=12, null=True)),
                ('otros_gastos', models.DecimalField(blank=True, decimal_places=2, max_digits=12, null=True)),
            ],
            options={
                'verbose_name': 'Caja',
                'verbose_name_plural': 'Cajas',
            },
        ),
    ]
