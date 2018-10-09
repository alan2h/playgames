# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2018-10-09 23:23
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Slides',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('imagen', models.ImageField(upload_to='pagina_web')),
            ],
            options={
                'verbose_name': 'Slide',
                'verbose_name_plural': 'Slides',
            },
        ),
    ]
