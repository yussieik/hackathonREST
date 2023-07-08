from django.core.management.base import BaseCommand
from recipes.api import save_data_from_api

class Command(BaseCommand):
    help = 'Fetches recipes from the Spoonacular API and saves them to the database'

    def handle(self, *args, **options):
        save_data_from_api()
        self.stdout.write(self.style.SUCCESS('Recipes saved successfully.'))