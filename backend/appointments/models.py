from django.db import models
from doctors.models import DoctorProfile
from patients.models import PatientProfile

class Appointment(models.Model):

   
    STATUS_CHOICES = [
    ('scheduled', 'Scheduled'),
    ('completed', 'Completed'),
    ('cancelled', 'Cancelled'),
]


    status = models.CharField(max_length=20,choices=STATUS_CHOICES,default='scheduled')
    doctor = models.ForeignKey(DoctorProfile,on_delete=models.CASCADE,related_name='appointments')
    patient = models.ForeignKey(PatientProfile,on_delete=models.CASCADE,related_name='appointments')
    appointment_date = models.DateTimeField()
    reason = models.TextField()

    # New fields for AI summaries and Google Calendar
    symptoms = models.TextField(blank=True)
    urgency_level = models.CharField(max_length=20, blank=True)
    pre_visit_summary = models.TextField(blank=True)
    post_visit_notes = models.TextField(blank=True)
    post_visit_summary = models.TextField(blank=True)
    google_event_id = models.CharField(max_length=255, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.patient.user.username} - {self.doctor.user.username}"