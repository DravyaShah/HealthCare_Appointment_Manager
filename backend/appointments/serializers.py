from rest_framework import serializers
from .models import Appointment
from django.utils import timezone


class AppointmentSerializer(serializers.ModelSerializer):
    doctor_name = serializers.SerializerMethodField()
    doctor_specialization = serializers.CharField(source='doctor.specialization', read_only=True)
    patient_name = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'doctor', 'patient']

    def get_doctor_name(self, obj):
        user = obj.doctor.user
        full_name = f"{user.first_name} {user.last_name}".strip().title()
        return full_name if full_name else user.username

    def get_patient_name(self, obj):
        user = obj.patient.user
        full_name = f"{user.first_name} {user.last_name}".strip().title()
        return full_name if full_name else user.username

    def validate_appointment_date(self, value):
        # Only validate on create, not on partial updates (PATCH)
        if self.instance is None:
            if value < timezone.now():
                raise serializers.ValidationError("Appointment date cannot be in the past.")
        return value

    def validate_status(self, value):
        if self.instance:
            current = self.instance.status
            allowed_transitions = {
                'scheduled': ['completed', 'cancelled'],
                'completed': [],
                'cancelled': [],
            }
            if value != current and value not in allowed_transitions.get(current, []):
                raise serializers.ValidationError(
                    f"Cannot change status from '{current}' to '{value}'."
                )
        return value