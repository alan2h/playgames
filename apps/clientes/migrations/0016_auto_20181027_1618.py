# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2018-10-27 19:18
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('clientes', '0015_cliente_puntos_premium'),
    ]

    operations = [
        migrations.CreateModel(
            name='TipoCliente',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('descripcion', models.CharField(max_length=3000)),
            ],
            options={
                'verbose_name': 'Tipo de Cliente',
                'verbose_name_plural': 'Tipos de Clientes',
            },
        ),
        migrations.AddField(
            model_name='cliente',
            name='tipo_cliente',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='clientes.TipoCliente'),
        ),
    ]
