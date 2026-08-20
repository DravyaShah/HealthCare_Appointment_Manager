from django.urls import path
from .views import PatientProfileAPI

urlpatterns=[
    path('profile/',PatientProfileAPI.as_view(),name="patient-profile-create"),
    path('profile/<int:pk>/',PatientProfileAPI.as_view(),name="patient-detail"),
]