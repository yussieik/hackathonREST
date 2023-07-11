from rest_framework import serializers
from .models import Category, Recipe, Ingredient

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = '__all__'

class RecipeSerializer(serializers.ModelSerializer):
   
    ingredients = IngredientSerializer(many=True)

    class Meta:
        model = Recipe
        fields = '__all__'
    
    #provide the count of users who have favorited the recipe
    # def get_favorited_by_count(self, obj):
    #     return obj.favorited_by.count()

    # def to_representation(self, instance):
    #     representation = super().to_representation(instance)
    #     representation['favorited_by_count'] = self.get_favorited_by_count(instance)
    #     return representation

