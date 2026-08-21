from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):

    ROLE_CHOICES = (
        ('patient', 'Patient'),
        ('doctor', 'Doctor'),
        ('admin', 'Admin'),
    )

    email = models.EmailField(unique=True)

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES
    )

    phone = models.CharField(
        max_length=15,
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email' # Use email for login authentication instead of username.
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f"{self.username} ({self.role})"


class GoogleCalendarCredentials(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='calendar_credentials')
    access_token = models.TextField()
    refresh_token = models.TextField(blank=True, null=True)
    token_expiry = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Calendar Credentials for {self.user.username}"
