from django.core.mail import send_mail
from django.conf import settings

def send_booking_confirmation(patient_email, doctor_name, appointment_date):
    subject = 'Appointment Booking Confirmation'
    message = f'Your appointment with Dr. {doctor_name} has been successfully scheduled for {appointment_date.strftime("%Y-%m-%d %H:%M")}.'
    from_email = settings.DEFAULT_FROM_EMAIL
    send_mail(subject, message, from_email, [patient_email], fail_silently=True)

def send_appointment_reminder(patient_email, doctor_name, appointment_date):
    subject = 'Appointment Reminder'
    message = f'This is a reminder for your upcoming appointment with Dr. {doctor_name} on {appointment_date.strftime("%Y-%m-%d %H:%M")}.'
    from_email = settings.DEFAULT_FROM_EMAIL
    send_mail(subject, message, from_email, [patient_email], fail_silently=True)

def send_cancellation_notice(patient_email, doctor_name, appointment_date):
    subject = 'Appointment Cancellation'
    message = f'Unfortunately, your appointment with Dr. {doctor_name} on {appointment_date.strftime("%Y-%m-%d %H:%M")} has been cancelled.'
    from_email = settings.DEFAULT_FROM_EMAIL
    send_mail(subject, message, from_email, [patient_email], fail_silently=True)

def send_medication_reminder(patient_email, medication_name, instructions):
    subject = 'Medication Reminder'
    message = f'Reminder to take your medication: {medication_name}.\nInstructions: {instructions}'
    from_email = settings.DEFAULT_FROM_EMAIL
    send_mail(subject, message, from_email, [patient_email], fail_silently=True)
