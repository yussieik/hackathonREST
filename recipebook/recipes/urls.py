from django.urls import path
from . import views
from .views import *


urlpatterns = [
    path('home/', home, name='home'),
    path('api/recipes/', RecipeListView.as_view(), name='recipe-list'),
    path('api/recipes/create/', RecipeCreateView.as_view(), name='recipe-create'),
    path('api/recipes/<int:pk>/', RecipeRetrieveUpdateDestroyView.as_view(), name='recipe-detail'),
    path('api/categories/', CategoryAPIView.as_view(), name='category-api'),
    path('api/categories/<int:category_id>/recipes/', CategoryRecipeListAPIView.as_view(), name='category-recipes'),
    path('api/categories/create/', CategoryCreateView.as_view(), name='category-api'),
    path('api/categories/<int:pk>', CategoryRetrieveUpdateDestroyView.as_view(), name='category-detail'),
    path('api/ingredients/', IngredientListView.as_view(), name='ingredient-list'),
    path('api/ingredients/create/', IngredientCreateView.as_view(), name='category-api'),
    path('api/ingredients/<int:pk>', IngredientRetrieveUpdateDestroyView.as_view(), name='category-detail'),
]