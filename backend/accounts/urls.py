from django.urls import path
from . import views
from .views import AccountAPI,CurrentUserAPI

urlpatterns=[
    path('register/', AccountAPI.as_view(), name='register'),
     path('me/', CurrentUserAPI.as_view(),name='current_user'),
    path('update/<int:pk>/', views.AccountUpdateAPI.as_view(), name='account-update'),
    path('change_password/<int:pk>/', views.ChangePasswordAPI.as_view(), name='change_password'),
]