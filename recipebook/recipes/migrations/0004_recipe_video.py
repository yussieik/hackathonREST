# Generated by Django 4.2.1 on 2023-07-08 19:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0003_remove_recipe_description'),
    ]

    operations = [
        migrations.AddField(
            model_name='recipe',
            name='video',
            field=models.URLField(default=1),
            preserve_default=False,
        ),
    ]
