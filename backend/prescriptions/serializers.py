from rest_framework import serializers
from .models import Prescription


class PrescriptionSerializer(serializers.ModelSerializer):

    doctor_name = serializers.SerializerMethodField()
    patient_name = serializers.SerializerMethodField()

    class Meta:

        model = Prescription

        fields = [
            'id',
            'appointment',
            'diagnosis',
            'medicines',
            'instructions',
            'follow_up_date',
            'created_at',
            'doctor_name',
            'patient_name'
        ]

        read_only_fields = [
            'id',
            'created_at'
        ]

    def get_doctor_name(self, obj):
        user = obj.appointment.doctor.user
        full_name = f"{user.first_name} {user.last_name}".strip()
        return full_name if full_name else user.username

    def get_patient_name(self, obj):
        user = obj.appointment.patient.user
        full_name = f"{user.first_name} {user.last_name}".strip()
        return full_name if full_name else user.username