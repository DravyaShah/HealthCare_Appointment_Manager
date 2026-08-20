from django.urls import path
from .views import PrescriptionAPI


urlpatterns = [
    path('prescriptions/',PrescriptionAPI.as_view(),name='prescription-list'),
    path('prescriptions/<int:pk>/',PrescriptionAPI.as_view(),name='prescription-detail'),
]