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
    slot_duration_minutes = models.PositiveIntegerField(default=30)

class DoctorLeave(models.Model):
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='leaves')
    leave_date = models.DateField()
    reason = models.TextField(blank=True)

    class Meta:
        unique_together = ('doctor', 'leave_date')

    def __str__(self):
        return f"{self.doctor.user.username} on leave on {self.leave_date}"

