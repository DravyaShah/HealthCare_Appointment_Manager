from django.db import models
from accounts.models import User
# Create your models here.

class PatientProfile(models.Model):

    user = models.OneToOneField(User,on_delete=models.CASCADE,related_name='patient_profile')
    
    age = models.PositiveIntegerField()
    blood_group = models.CharField(max_length=5)
    allergies = models.TextField(blank=True)
    emergency_contact = models.CharField(max_length=15)
    medical_history = models.TextField(blank=True)