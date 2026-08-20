from rest_framework import serializers
from .models import DoctorProfile

class DoctorProfileSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)

    class Meta:
        model = DoctorProfile
        fields = ['id', 'user', 'user_name', 'first_name', 'last_name', 'specialization', 'experience_years', 'license_number', 'hospital_name', 'consultation_fee', 'bio', 'is_available']
        read_only_fields = ['id', 'user_name', 'first_name', 'last_name']

