from rest_framework import serializers
from .models import User


class AccountSerializer(serializers.ModelSerializer):

    class Meta:
        model = User

        fields = [
            'email',
            'username',
            'first_name',
            'last_name',
            'password',
            'role',
            'phone',
        ]

        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):

        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            role=validated_data['role'],
            phone=validated_data.get('phone'),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )

        from patients.models import PatientProfile
        from doctors.models import DoctorProfile

        if user.role == 'patient':
            PatientProfile.objects.create(
                user=user,
                age=0,  # Default or placeholder values
                blood_group='O+',
                allergies='',
                emergency_contact='',
                medical_history=''
            )
        elif user.role == 'doctor':
            DoctorProfile.objects.create(
                user=user,
                specialization='General',
                qualification='',
                experience_years=0,
                license_number='PENDING',
                hospital_name='Not Specified',
                consultation_fee=0.00
            )

        return user