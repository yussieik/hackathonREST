from django.contrib import admin
from .models import *


class RecipeAdmin(admin.ModelAdmin):
    # Specify the fields to display in the admin list view
    list_display = ['title', 'category', 'author']

    # Specify the field to use for sorting
    ordering = ['title']

admin.site.register(Category)
admin.site.register(Ingredient)
admin.site.register(Recipe, RecipeAdmin)
