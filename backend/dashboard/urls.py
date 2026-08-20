from django.urls import path
from .views import (
    DoctorDashboardAPI,
    PatientDashboardAPI
)

urlpatterns = [
    path('doctor/',DoctorDashboardAPI.as_view(),name='doctor-dashboard'),
    path('patient/',PatientDashboardAPI.as_view(),name='patient-dashboard'),
]