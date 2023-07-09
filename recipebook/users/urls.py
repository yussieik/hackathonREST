from django.urls import path
from . import views
from users import views as user_views

urlpatterns = [
    path('login/', views.sign_in, name='login'),
    path('logout/', views.sign_out, name='logout'),
    path('register/', views.sign_up, name='register'),
    path('profile/', user_views.profile, name='profile'),
]

