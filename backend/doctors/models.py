from django.db import models 
from accounts.models import User

class DoctorProfile(models.Model):
    # Define your model fields here
    user = models.OneToOneField(User,on_delete=models.CASCADE, related_name='doctor_profile')

    specialization = models.CharField(max_length=100)
    qualification = models.CharField(max_length=200)
    experience_years = models.PositiveIntegerField()
    license_number = models.CharField(max_length=100)
    hospital_name = models.CharField(max_length=200)
    consultation_fee = models.DecimalField(max_digits=8, decimal_places=2)
    bio = models.TextField(blank=True)
    is_available = models.BooleanField(default=True)
