from .models import *
from rest_framework import status
from rest_framework import generics
from rest_framework.permissions import (AllowAny,IsAuthenticated)
from .serializers import *
from rest_framework.generics import (ListAPIView, CreateAPIView, RetrieveUpdateDestroyAPIView)
from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Category, Recipe
from .serializers import CategorySerializer, RecipeSerializer
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required


def home(request):
   return render(request, 'recipes/index.html')

class Favorites(APIView):
    permission_classes = (IsAuthenticated, )

    def post(self, request):
        recipe_id = request.data.get('id')
        user = request.user

        try:
            recipe = Recipe.objects.get(id=recipe_id)
        except Recipe.DoesNotExist:
            return Response({'error': 'Recipe not found'}, status=status.HTTP_404_NOT_FOUND)

        if recipe.favorited_by.filter(id=user.id).exists():
            # Recipe already favorited by the user, remove it from favorites
            recipe.favorited_by.remove(user)
            return Response({'status': 'Recipe removed from favorites'}, status=status.HTTP_200_OK)
        else:
            # Recipe not favorited by the user, add it to favorites
            recipe.favorited_by.add(user)
            return Response({'status': 'Recipe added to favorites'}, status=status.HTTP_201_CREATED)

# all recipes
class RecipeListView(ListAPIView):
   queryset = Recipe.objects.all()
   serializer_class = RecipeSerializer
   permission_classes = (AllowAny, )

# create
class RecipeCreateView(CreateAPIView):
   queryset = Recipe.objects.all()
   serializer_class = RecipeSerializer
   permission_classes = (IsAuthenticated, )

# get - update - delete
class RecipeRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = (IsAuthenticated, )

   
# all categories list
class CategoryRecipeListAPIView(ListAPIView):
    serializer_class = RecipeSerializer

    def get_queryset(self):
        category_id = self.kwargs['category_id']
        return Recipe.objects.filter(category_id=category_id)

# recipes from one category
class CategoryAPIView(APIView):
    def get(self, request, *args, **kwargs):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
    

# create
class CategoryCreateView(CreateAPIView):
   queryset = Category.objects.all()
   serializer_class = CategorySerializer
   permission_classes = (IsAuthenticated, )

# get - update - delete
class CategoryRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = (IsAuthenticated, )


# all ingredients
class IngredientListView(ListAPIView):
   queryset = Ingredient.objects.all()
   serializer_class = IngredientSerializer
   permission_classes = (AllowAny, )

# create
class IngredientCreateView(CreateAPIView):
   queryset = Ingredient.objects.all()
   serializer_class = IngredientSerializer
   permission_classes = (IsAuthenticated, )

# get - update - delete
class IngredientRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer
    permission_classes = (IsAuthenticated, )