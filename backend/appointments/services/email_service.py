from django.core.mail import send_mail
from django.conf import settings

def send_booking_confirmation(patient_email, doctor_email, patient_name, doctor_name, appointment_date):
    # Patient Email
    subject_p = 'Appointment Booking Confirmation'
    message_p = f'Dear {patient_name},\n\nYour appointment with Dr. {doctor_name} has been successfully scheduled for {appointment_date.strftime("%Y-%m-%d %H:%M")}.'
    
    # Doctor Email
    subject_d = 'New Appointment Scheduled'
    message_d = f'Dear Dr. {doctor_name},\n\nA new appointment has been scheduled with patient {patient_name} for {appointment_date.strftime("%Y-%m-%d %H:%M")}.'
    
    from_email = settings.DEFAULT_FROM_EMAIL
    
    send_mail(subject_p, message_p, from_email, [patient_email], fail_silently=False)
    send_mail(subject_d, message_d, from_email, [doctor_email], fail_silently=False)

def send_appointment_reminder(patient_email, doctor_email, patient_name, doctor_name, appointment_date):
    # Patient Email
    subject_p = 'Appointment Reminder'
    message_p = f'Dear {patient_name},\n\nThis is a reminder for your upcoming appointment with Dr. {doctor_name} on {appointment_date.strftime("%Y-%m-%d %H:%M")}.'
    
    # Doctor Email
    subject_d = 'Upcoming Appointment Reminder'
    message_d = f'Dear Dr. {doctor_name},\n\nThis is a reminder for your upcoming appointment with patient {patient_name} on {appointment_date.strftime("%Y-%m-%d %H:%M")}.'
    
    from_email = settings.DEFAULT_FROM_EMAIL
    
    send_mail(subject_p, message_p, from_email, [patient_email], fail_silently=False)
    send_mail(subject_d, message_d, from_email, [doctor_email], fail_silently=False)

def send_cancellation_notice(patient_email, doctor_email, patient_name, doctor_name, appointment_date, cancelled_by):
    subject = 'Appointment Cancellation'
    message_p = f'Dear {patient_name},\n\nUnfortunately, your appointment with Dr. {doctor_name} on {appointment_date.strftime("%Y-%m-%d %H:%M")} has been cancelled.'
    message_d = f'Dear Dr. {doctor_name},\n\nThe appointment with patient {patient_name} on {appointment_date.strftime("%Y-%m-%d %H:%M")} has been cancelled.'
    
    if cancelled_by == 'doctor':
        message_p += "\nThe cancellation was requested by the doctor."
    elif cancelled_by == 'patient':
        message_d += "\nThe cancellation was requested by the patient."
        
    from_email = settings.DEFAULT_FROM_EMAIL
    
    send_mail(subject, message_p, from_email, [patient_email], fail_silently=False)
    send_mail(subject, message_d, from_email, [doctor_email], fail_silently=False)

def send_reschedule_notice(patient_email, doctor_email, patient_name, doctor_name, old_date, new_date):
    subject = 'Appointment Rescheduled'
    message_p = f'Dear {patient_name},\n\nYour appointment with Dr. {doctor_name} originally on {old_date.strftime("%Y-%m-%d %H:%M")} has been rescheduled to {new_date.strftime("%Y-%m-%d %H:%M")}.'
    message_d = f'Dear Dr. {doctor_name},\n\nYour appointment with patient {patient_name} originally on {old_date.strftime("%Y-%m-%d %H:%M")} has been rescheduled to {new_date.strftime("%Y-%m-%d %H:%M")}.'
    
    from_email = settings.DEFAULT_FROM_EMAIL
    send_mail(subject, message_p, from_email, [patient_email], fail_silently=False)
    send_mail(subject, message_d, from_email, [doctor_email], fail_silently=False)

def send_leave_cancellation_notice(patient_email, doctor_email, patient_name, doctor_name, appointment_date):
    subject = 'Appointment Cancelled Due to Doctor Leave'
    message_p = f'Dear {patient_name},\n\nWe regret to inform you that your appointment with Dr. {doctor_name} on {appointment_date.strftime("%Y-%m-%d %H:%M")} has been cancelled as the doctor is unexpectedly on leave. Please reschedule your appointment.'
    message_d = f'Dear Dr. {doctor_name},\n\nYour appointment with patient {patient_name} on {appointment_date.strftime("%Y-%m-%d %H:%M")} has been cancelled due to your leave.'
    
    from_email = settings.DEFAULT_FROM_EMAIL
    send_mail(subject, message_p, from_email, [patient_email], fail_silently=False)
    send_mail(subject, message_d, from_email, [doctor_email], fail_silently=False)

def send_medication_reminder(patient_email, medication_name, instructions):
    subject = 'Medication Reminder'
    message = f'Reminder to take your medication: {medication_name}.\nInstructions: {instructions}'
    from_email = settings.DEFAULT_FROM_EMAIL
    send_mail(subject, message, from_email, [patient_email], fail_silently=False)
