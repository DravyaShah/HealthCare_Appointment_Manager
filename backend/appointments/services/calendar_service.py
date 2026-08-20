from google.oauth2 import service_account
from googleapiclient.discovery import build
from django.conf import settings
import datetime
import os

SCOPES = ['https://www.googleapis.com/auth/calendar']

def get_calendar_service():
    creds = None
    if settings.GOOGLE_APPLICATION_CREDENTIALS and os.path.exists(settings.GOOGLE_APPLICATION_CREDENTIALS):
        creds = service_account.Credentials.from_service_account_file(
            settings.GOOGLE_APPLICATION_CREDENTIALS, scopes=SCOPES)
    if not creds:
        print("Warning: Google Application Credentials not provided or invalid. Calendar events will not be created.")
        return None
    
    return build('calendar', 'v3', credentials=creds)

def create_calendar_event(appointment, summary, description):
    service = get_calendar_service()
    if not service:
        return None

    # Calculate end time based on doctor's slot duration
    duration = appointment.doctor.slot_duration_minutes
    start_time = appointment.appointment_date
    end_time = start_time + datetime.timedelta(minutes=duration)

    event = {
        'summary': summary,
        'description': description,
        'start': {
            'dateTime': start_time.isoformat(),
            'timeZone': settings.TIME_ZONE,
        },
        'end': {
            'dateTime': end_time.isoformat(),
            'timeZone': settings.TIME_ZONE,
        },
        'attendees': [
            {'email': appointment.patient.user.email},
            {'email': appointment.doctor.user.email},
        ],
        'reminders': {
            'useDefault': False,
            'overrides': [
                {'method': 'email', 'minutes': 24 * 60},
                {'method': 'popup', 'minutes': 30},
            ],
        },
    }

    try:
        event_result = service.events().insert(calendarId='primary', body=event, sendUpdates='all').execute()
        return event_result.get('id')
    except Exception as e:
        print(f"Error creating calendar event: {e}")
        return None

def delete_calendar_event(event_id):
    if not event_id:
        return
    service = get_calendar_service()
    if not service:
        return
    try:
        service.events().delete(calendarId='primary', eventId=event_id, sendUpdates='all').execute()
    except Exception as e:
        print(f"Error deleting calendar event: {e}")

def update_calendar_event(appointment, event_id, summary, description):
    if not event_id:
        return None
    service = get_calendar_service()
    if not service:
        return None

    duration = appointment.doctor.slot_duration_minutes
    start_time = appointment.appointment_date
    end_time = start_time + datetime.timedelta(minutes=duration)

    event = {
        'summary': summary,
        'description': description,
        'start': {
            'dateTime': start_time.isoformat(),
            'timeZone': settings.TIME_ZONE,
        },
        'end': {
            'dateTime': end_time.isoformat(),
            'timeZone': settings.TIME_ZONE,
        },
        'attendees': [
            {'email': appointment.patient.user.email},
            {'email': appointment.doctor.user.email},
        ],
    }

    try:
        event_result = service.events().update(calendarId='primary', eventId=event_id, body=event, sendUpdates='all').execute()
        return event_result.get('id')
    except Exception as e:
        print(f"Error updating calendar event: {e}")
        return None
