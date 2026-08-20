from rest_framework import serializers
from .models import PatientProfile

class PatientProfileSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)

    class Meta:
        model = PatientProfile
        fields = ['id', 'user', 'user_name', 'first_name', 'last_name', 'age', 'blood_group', 'allergies', 'emergency_contact', 'medical_history']
        read_only_fields = ['id', 'user_name', 'first_name', 'last_name']
        