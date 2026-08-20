from django.urls import path
from .views import DoctorProfileAPI

urlpatterns=[
    path('profile/<int:pk>/', DoctorProfileAPI.as_view(), name='doctor-detail'),
    path('profile/', DoctorProfileAPI.as_view(), name='doctor-profile-create'),
]
