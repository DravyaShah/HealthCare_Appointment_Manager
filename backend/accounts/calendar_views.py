from django.shortcuts import redirect
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import GoogleCalendarCredentials
import os
import requests
import datetime
from django.utils import timezone

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def google_auth(request):
    client_id = os.environ.get('GOOGLE_CLIENT_ID', getattr(settings, 'GOOGLE_CLIENT_ID', ''))
    redirect_uri = os.environ.get('GOOGLE_REDIRECT_URI', getattr(settings, 'GOOGLE_REDIRECT_URI', ''))
    if not client_id or not redirect_uri:
        return Response({"error": "Google OAuth is not configured on the server."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # We can use the state param to pass the JWT token or session info so the callback knows who it is.
    # For a frontend SPA, a better way is to have the frontend initiate OAuth and send the code to the backend.
    # Since we are asked to build /api/calendar/google/auth and /callback, we'll implement it.
    
    scope = 'https://www.googleapis.com/auth/calendar'
    
    auth_url = (
        f"https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={client_id}&"
        f"redirect_uri={redirect_uri}&"
        f"response_type=code&"
        f"scope={scope}&"
        f"access_type=offline&"
        f"prompt=consent&"
        f"state={request.user.id}"  # Simple state to remember user, in production use a secure JWT
    )
    return Response({"auth_url": auth_url})


@api_view(['GET'])
def google_callback(request):
    code = request.GET.get('code')
    user_id = request.GET.get('state')
    
    if not code or not user_id:
        return Response({"error": "Missing code or state parameters."}, status=status.HTTP_400_BAD_REQUEST)

    client_id = os.environ.get('GOOGLE_CLIENT_ID', getattr(settings, 'GOOGLE_CLIENT_ID', ''))
    client_secret = os.environ.get('GOOGLE_CLIENT_SECRET', getattr(settings, 'GOOGLE_CLIENT_SECRET', ''))
    redirect_uri = os.environ.get('GOOGLE_REDIRECT_URI', getattr(settings, 'GOOGLE_REDIRECT_URI', ''))

    token_url = "https://oauth2.googleapis.com/token"
    data = {
        'code': code,
        'client_id': client_id,
        'client_secret': client_secret,
        'redirect_uri': redirect_uri,
        'grant_type': 'authorization_code',
    }

    response = requests.post(token_url, data=data)
    if response.status_code != 200:
        return Response({"error": "Failed to exchange authorization code for tokens."}, status=status.HTTP_400_BAD_REQUEST)

    token_data = response.json()
    access_token = token_data.get('access_token')
    refresh_token = token_data.get('refresh_token')
    expires_in = token_data.get('expires_in')

    if not access_token:
        return Response({"error": "No access token found in response."}, status=status.HTTP_400_BAD_REQUEST)

    expiry = timezone.now() + datetime.timedelta(seconds=expires_in)

    # Save to user
    try:
        from .models import User
        user = User.objects.get(id=user_id)
        creds, created = GoogleCalendarCredentials.objects.get_or_create(user=user)
        creds.access_token = access_token
        if refresh_token:
            creds.refresh_token = refresh_token
        creds.token_expiry = expiry
        creds.save()
        
        # Redirect to frontend
        frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:5173')
        return redirect(f"{frontend_url}/profile?calendar=success")
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def calendar_status(request):
    try:
        connected = request.user.calendar_credentials is not None
    except Exception:
        connected = False
    return Response({"connected": connected})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def calendar_disconnect(request):
    try:
        if request.user.calendar_credentials:
            request.user.calendar_credentials.delete()
            return Response({"message": "Calendar disconnected successfully."})
    except Exception:
        pass
    return Response({"message": "Calendar is already disconnected."}, status=status.HTTP_400_BAD_REQUEST)
