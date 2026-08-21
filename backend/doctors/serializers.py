from rest_framework import serializers
from .models import DoctorProfile

class DoctorProfileSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    name = serializers.SerializerMethodField()

    class Meta:
        model = DoctorProfile
        fields = ['id', 'user', 'user_name', 'first_name', 'last_name', 'name', 'specialization', 'experience_years', 'license_number', 'hospital_name', 'consultation_fee', 'bio', 'is_available']
        read_only_fields = ['id', 'user_name', 'first_name', 'last_name', 'name']

    def get_name(self, obj):
        user = obj.user
        full_name = f"Dr. {user.first_name} {user.last_name}".strip()
        if full_name == "Dr.":
            return f"Dr. {user.username}"
        return full_name
