import requests
from .models import Recipe, Ingredient, Category
from django.contrib.auth.models import User



def save_data_from_api():
    url = 'https://www.themealdb.com/api/json/v1/1/random.php'
    response = requests.get(url)
    data = response.json()

    if response.status_code == 200 and 'meals' in data:
        meals = data['meals']
        for meal in meals:
            # Extract relevant data from the API response
            title = meal['strMeal']
            instructions = meal['strInstructions']
            image_url = meal['strMealThumb']  # Fetch the image URL
            # Add more fields as needed

            # Create or retrieve the category
            category_name = meal['strCategory']
            category, _ = Category.objects.get_or_create(name=category_name)

            # Create or retrieve the default author
            default_author, _ = User.objects.get_or_create(username='default_author')

            # Create a new Recipe object
            recipe = Recipe(title=title, instructions=instructions, category=category, author=default_author, img=image_url)  # Save the image URL
            recipe.save()

            # Save ingredients
            for i in range(1, 21):
                ingredient_name = meal[f'strIngredient{i}']
                ingredient_measure = meal[f'strMeasure{i}']

                if ingredient_name and ingredient_measure:
                    ingredient, _ = Ingredient.objects.get_or_create(name=ingredient_name)
                    recipe.ingredients.add(ingredient, through_defaults={'quantity': ingredient_measure})
