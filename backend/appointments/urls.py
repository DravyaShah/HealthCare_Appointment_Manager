from django.urls import path
from .views import AppointmentAPI

urlpatterns=[
    path('appointments/',AppointmentAPI.as_view(),name='appointments'),
    path('appointments/<int:pk>/',AppointmentAPI.as_view(),name='appointment-detail'),
]