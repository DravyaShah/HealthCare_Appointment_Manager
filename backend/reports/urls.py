from django.urls import path
from . import views
from .views import ReportAPI

urlpatterns = [
    path('reports/', ReportAPI.as_view()),
    path('reports/<int:pk>/', ReportAPI.as_view()),
]