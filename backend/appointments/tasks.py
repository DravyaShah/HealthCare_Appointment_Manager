from celery import shared_task
from django.utils import timezone
import datetime
from .models import Appointment
from .services.email_service import (
    send_appointment_reminder,
    send_booking_confirmation,
    send_cancellation_notice,
    send_reschedule_notice,
    send_leave_cancellation_notice
)
from .services.calendar_service import (
    create_calendar_event,
    update_calendar_event,
    delete_calendar_event
)

@shared_task
def send_reminders():
    # Find appointments that are exactly 24 hours away
    now = timezone.now()
    tomorrow = now + datetime.timedelta(days=1)
    
    # We look for appointments within a 1-hour window starting 24h from now
    appointments = Appointment.objects.filter(
        appointment_date__range=(tomorrow, tomorrow + datetime.timedelta(hours=1)),
        status='scheduled'
    )
    
    for appointment in appointments:
        send_appointment_reminder(
            appointment.patient.user.email,
            appointment.doctor.user.email,
            appointment.patient.user.get_full_name() or appointment.patient.user.username,
            appointment.doctor.user.get_full_name() or appointment.doctor.user.username,
            appointment.appointment_date
        )

@shared_task(bind=True, max_retries=3)
def send_booking_email_task(self, appointment_id):
    try:
        appointment = Appointment.objects.select_related('patient__user', 'doctor__user').get(id=appointment_id)
        send_booking_confirmation(
            appointment.patient.user.email,
            appointment.doctor.user.email,
            appointment.patient.user.get_full_name() or appointment.patient.user.username,
            appointment.doctor.user.get_full_name() or appointment.doctor.user.username,
            appointment.appointment_date
        )
        appointment.email_notification_status = 'Sent'
        appointment.save(update_fields=['email_notification_status'])
    except Exception as exc:
        if appointment:
            appointment.email_notification_status = 'Failed'
            appointment.save(update_fields=['email_notification_status'])
        raise self.retry(exc=exc, countdown=60)

@shared_task(bind=True, max_retries=3)
def send_cancellation_email_task(self, appointment_id, cancelled_by):
    try:
        appointment = Appointment.objects.select_related('patient__user', 'doctor__user').get(id=appointment_id)
        send_cancellation_notice(
            appointment.patient.user.email,
            appointment.doctor.user.email,
            appointment.patient.user.get_full_name() or appointment.patient.user.username,
            appointment.doctor.user.get_full_name() or appointment.doctor.user.username,
            appointment.appointment_date,
            cancelled_by
        )
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60)

@shared_task(bind=True, max_retries=3)
def send_reschedule_email_task(self, appointment_id, old_date):
    try:
        if isinstance(old_date, str):
            from django.utils.dateparse import parse_datetime
            old_date = parse_datetime(old_date)
            
        appointment = Appointment.objects.select_related('patient__user', 'doctor__user').get(id=appointment_id)
        send_reschedule_notice(
            appointment.patient.user.email,
            appointment.doctor.user.email,
            appointment.patient.user.get_full_name() or appointment.patient.user.username,
            appointment.doctor.user.get_full_name() or appointment.doctor.user.username,
            old_date,
            appointment.appointment_date
        )
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60)

@shared_task(bind=True, max_retries=3)
def send_leave_cancellation_email_task(self, appointment_id):
    try:
        appointment = Appointment.objects.select_related('patient__user', 'doctor__user').get(id=appointment_id)
        send_leave_cancellation_notice(
            appointment.patient.user.email,
            appointment.doctor.user.email,
            appointment.patient.user.get_full_name() or appointment.patient.user.username,
            appointment.doctor.user.get_full_name() or appointment.doctor.user.username,
            appointment.appointment_date
        )
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60)

@shared_task(bind=True, max_retries=3)
def sync_calendar_task(self, appointment_id, summary, description):
    try:
        appointment = Appointment.objects.select_related('patient__user', 'doctor__user').get(id=appointment_id)
        event_id = create_calendar_event(appointment, summary, description)
        if event_id:
            appointment.google_event_id = event_id
            appointment.calendar_sync_status = 'Synced'
        else:
            appointment.calendar_sync_status = 'Pending' # No calendar connected
        appointment.save(update_fields=['google_event_id', 'calendar_sync_status'])
    except Exception as exc:
        appointment = Appointment.objects.get(id=appointment_id)
        appointment.calendar_sync_status = 'Failed'
        appointment.calendar_sync_error = str(exc)
        appointment.calendar_retry_count += 1
        appointment.save(update_fields=['calendar_sync_status', 'calendar_sync_error', 'calendar_retry_count'])
        raise self.retry(exc=exc, countdown=60)

@shared_task(bind=True, max_retries=3)
def update_calendar_task(self, appointment_id, summary, description):
    try:
        appointment = Appointment.objects.select_related('patient__user', 'doctor__user').get(id=appointment_id)
        event_id = update_calendar_event(appointment, summary, description)
        if event_id and not appointment.google_event_id:
            appointment.google_event_id = event_id
            appointment.calendar_sync_status = 'Synced'
            appointment.save(update_fields=['google_event_id', 'calendar_sync_status'])
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60)

@shared_task(bind=True, max_retries=3)
def delete_calendar_task(self, appointment_id):
    try:
        appointment = Appointment.objects.select_related('patient__user', 'doctor__user').get(id=appointment_id)
        delete_calendar_event(appointment)
        appointment.calendar_sync_status = 'Pending'
        appointment.google_event_id = ''
        appointment.save(update_fields=['calendar_sync_status', 'google_event_id'])
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60)
