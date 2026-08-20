from rest_framework import serializers

from .models import Report
from appointments.models import Appointment


class ReportSerializer(serializers.ModelSerializer):

    doctor_name = serializers.SerializerMethodField()
    patient_name = serializers.SerializerMethodField()
    report_file_url = serializers.SerializerMethodField()

    class Meta:
        model = Report

        fields = [
            'id',
            'appointment',
            'title',
            'report_file',
            'report_file_url',
            'description',
            'ai_summary',
            'uploaded_at',
            'updated_at',
            'doctor_name',
            'patient_name'
        ]

        read_only_fields = ['id', 'uploaded_at', 'updated_at']

    def get_doctor_name(self, obj):
        user = obj.appointment.doctor.user
        full_name = f"{user.first_name} {user.last_name}".strip()
        return full_name if full_name else user.username

    def get_patient_name(self, obj):
        user = obj.appointment.patient.user
        full_name = f"{user.first_name} {user.last_name}".strip()
        return full_name if full_name else user.username

    def get_report_file_url(self, obj):
        if obj.report_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.report_file.url)
            return obj.report_file.url
        return None

    def validate_appointment(self, value):
        if not Appointment.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("Appointment does not exist.")
        return value