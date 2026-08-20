from django.db import models
from doctors.models import DoctorProfile
from patients.models import PatientProfile
# Create your models here.
from django.db import models
from appointments.models import Appointment



def report_upload_path(instance, filename):

    patient_id = instance.appointment.patient.id
    appointment_id = instance.appointment.id

    return (
        f"reports/patient_{patient_id}/"
        f"appointment_{appointment_id}/"
         f"{filename}"
        )
class Report(models.Model):


    appointment = models.ForeignKey(Appointment,on_delete=models.CASCADE,related_name='reports')
    title = models.CharField(max_length=255)
    report_file = models.FileField(upload_to=report_upload_path)
    description = models.TextField(blank=True)
    ai_summary = models.TextField(blank=True)

    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    def delete(self, *args, **kwargs):

        if self.report_file:
            self.report_file.delete(save=False)

        super().delete(*args, **kwargs)
    

