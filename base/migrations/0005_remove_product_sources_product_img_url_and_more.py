# Generated by Django 4.2.1 on 2023-06-13 11:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0004_favorite_unique_favorite'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='product',
            name='sources',
        ),
        migrations.AddField(
            model_name='product',
            name='img_url',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='product',
            name='link_url',
            field=models.CharField(max_length=255, null=True),
        ),
    ]