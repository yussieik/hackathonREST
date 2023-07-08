from .models import *
import requests
from rest_framework import generics
from rest_framework.permissions import (AllowAny,IsAuthenticated)
from .serializers import *
from rest_framework.generics import (ListAPIView, CreateAPIView, RetrieveUpdateDestroyAPIView)
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Category, Recipe
from .serializers import CategorySerializer, RecipeSerializer


def home(request):
   return render(request, 'recipes/index.html')

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