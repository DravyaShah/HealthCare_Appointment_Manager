import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from doctors.models import DoctorProfile

User = get_user_model()

# Create a doctor user
doctor_email = 'doctor@healthai.com'
if not User.objects.filter(email=doctor_email).exists():
    user = User.objects.create_user(
        email=doctor_email,
        username='dr_jenkins',
        password='password123',
        role='doctor',
        first_name='Sarah',
        last_name='Jenkins'
    )
    print(f"Created user {user.username}")
    
    DoctorProfile.objects.create(
        user=user,
        specialization='Cardiology',
        experience_years=12,
        consultation_fee=150.00
    )
    print("Created DoctorProfile for dr_jenkins")
else:
    print("Doctor already exists")
