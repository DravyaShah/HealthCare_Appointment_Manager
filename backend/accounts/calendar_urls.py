from django.urls import path
from . import calendar_views

urlpatterns = [
    path('google/auth/', calendar_views.google_auth, name='google_auth'),
    path('google/callback/', calendar_views.google_callback, name='google_callback'),
    path('status/', calendar_views.calendar_status, name='calendar_status'),
    path('disconnect/', calendar_views.calendar_disconnect, name='calendar_disconnect'),
]
