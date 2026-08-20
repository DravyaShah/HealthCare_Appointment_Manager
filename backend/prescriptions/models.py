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