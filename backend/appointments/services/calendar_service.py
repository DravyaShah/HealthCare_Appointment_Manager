from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from django.conf import settings
from accounts.models import GoogleCalendarCredentials
import datetime
import os

SCOPES = ['https://www.googleapis.com/auth/calendar']

def get_credentials(user):
    try:
        creds_model = user.calendar_credentials
        creds = Credentials(
            token=creds_model.access_token,
            refresh_token=creds_model.refresh_token,
            token_uri="https://oauth2.googleapis.com/token",
            client_id=os.environ.get('GOOGLE_CLIENT_ID', settings.GOOGLE_CLIENT_ID if hasattr(settings, 'GOOGLE_CLIENT_ID') else ''),
            client_secret=os.environ.get('GOOGLE_CLIENT_SECRET', settings.GOOGLE_CLIENT_SECRET if hasattr(settings, 'GOOGLE_CLIENT_SECRET') else ''),
            scopes=SCOPES
        )
        if creds.expired and creds.refresh_token:
            from google.auth.transport.requests import Request
            creds.refresh(Request())
            # Save refreshed token
            creds_model.access_token = creds.token
            creds_model.token_expiry = creds.expiry
            creds_model.save()
        return creds
    except Exception as e:
        print(f"Error getting calendar credentials for {user}: {e}")
        return None

def get_calendar_service(user):
    creds = get_credentials(user)
    if not creds:
        return None
    return build('calendar', 'v3', credentials=creds)

def create_calendar_event(appointment, summary, description):
    # Try doctor's calendar first
    service = get_calendar_service(appointment.doctor.user)
    if not service:
        # Fallback to patient's calendar
        service = get_calendar_service(appointment.patient.user)
        
    if not service:
        # Neither has connected calendar
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
        raise e

def delete_calendar_event(appointment):
    if not appointment.google_event_id:
        return
        
    service = get_calendar_service(appointment.doctor.user)
    if not service:
        service = get_calendar_service(appointment.patient.user)
        
    if not service:
        return
        
    try:
        service.events().delete(calendarId='primary', eventId=appointment.google_event_id, sendUpdates='all').execute()
    except Exception as e:
        print(f"Error deleting calendar event: {e}")
        # Ignore 404s if already deleted
        pass

def update_calendar_event(appointment, summary, description):
    if not appointment.google_event_id:
        return create_calendar_event(appointment, summary, description)
        
    service = get_calendar_service(appointment.doctor.user)
    if not service:
        service = get_calendar_service(appointment.patient.user)
        
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
        event_result = service.events().update(calendarId='primary', eventId=appointment.google_event_id, body=event, sendUpdates='all').execute()
        return event_result.get('id')
    except Exception as e:
        print(f"Error updating calendar event: {e}")
        raise e
