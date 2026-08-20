from django.db import models
from appointments.models import Appointment



class Prescription(models.Model):

    appointment = models.OneToOneField(
        Appointment,
        on_delete=models.CASCADE,
        related_name='prescription'
    )

    diagnosis = models.TextField()
    medicines = models.TextField()
    instructions = models.TextField()
    follow_up_date = models.DateField(null=True,blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Prescription - {self.appointment.pk}"

class Medication(models.Model):
    prescription = models.ForeignKey(Prescription, on_delete=models.CASCADE, related_name='medications_list')
    name = models.CharField(max_length=200)
    frequency = models.CharField(max_length=100, help_text="e.g., '1-0-1', 'Once a day'")
    duration_days = models.PositiveIntegerField(help_text="Duration in days")
    start_date = models.DateField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} for {self.prescription.appointment.patient.user.username}"