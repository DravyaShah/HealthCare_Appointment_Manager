from celery import shared_task
from django.utils import timezone
import datetime
from .models import Appointment
from .services.email_service import send_appointment_reminder
from .services.calendar_service import create_calendar_event

@shared_task
def send_reminders():
    # Find appointments that are exactly 24 hours away
    now = timezone.now()
    tomorrow = now + datetime.timedelta(days=1)
    
    # We look for appointments within a 1-hour window starting 24h from now
    appointments = Appointment.objects.filter(
        appointment_date__range=(tomorrow, tomorrow + datetime.timedelta(hours=1)),
        status='Booked'
    )
    
    for appointment in appointments:
        send_appointment_reminder(
            appointment.patient.user.email,
            appointment.doctor.user.get_full_name(),
            appointment.appointment_date
        )

@shared_task(bind=True, max_retries=3)
def sync_calendar_task(self, appointment_id, summary, description):
    try:
        appointment = Appointment.objects.get(id=appointment_id)
        event_id = create_calendar_event(appointment, summary, description)
        if event_id:
            appointment.google_event_id = event_id
            appointment.save(update_fields=['google_event_id'])
    except Exception as exc:
        # Retry in case of transient API errors
        raise self.retry(exc=exc, countdown=60)
