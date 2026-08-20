from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from appointments.models import Appointment
from reports.models import Report
from prescriptions.models import Prescription
from rest_framework.permissions import IsAuthenticated
from appointments.serializers import AppointmentSerializer
from reports.serializers import ReportSerializer


#API for dashboard data
class DoctorDashboardAPI(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != 'doctor':
            return Response(
                {"error": "Only doctors can access this dashboard."},
                status=403
            )

        if not hasattr(request.user, 'doctor_profile'):
            return Response(
                {"error": "Doctor profile not found. Please complete your registration."},
                status=404
            )

        doctor = request.user.doctor_profile

        #Filtering appointments for the doctor
        appointments = Appointment.objects.filter(
            doctor=doctor
        )

        # Get recent scheduled appointments for the dashboard list
        recent_appointments = Appointment.objects.select_related(
            'doctor', 'patient', 'doctor__user', 'patient__user'
        ).filter(
            doctor=doctor,
            status='scheduled'
        ).order_by('appointment_date')[:5]

        # Get recent reports
        recent_reports = Report.objects.select_related(
            'appointment', 'appointment__doctor', 'appointment__patient',
            'appointment__doctor__user', 'appointment__patient__user'
        ).filter(
            appointment__doctor=doctor
        ).order_by('-uploaded_at')[:5]

        data = {

            "total_patients":
                appointments.values(
                    'patient'
                ).distinct().count(),

            "total_appointments":
                appointments.count(),

            "scheduled_appointments":
                appointments.filter(
                    status='scheduled'
                ).count(),

            "completed_appointments":
                appointments.filter(
                    status='completed'
                ).count(),

            "cancelled_appointments":
                appointments.filter(
                    status='cancelled'
                ).count(),

            "total_reports":
                Report.objects.filter(
                    appointment__doctor=doctor
                ).count(),

            "total_prescriptions":
                Prescription.objects.filter(
                    appointment__doctor=doctor
                ).count(),

            "recent_appointments":
                AppointmentSerializer(recent_appointments, many=True).data,

            "recent_reports":
                ReportSerializer(recent_reports, many=True, context={'request': request}).data,
        }

        return Response(data)


class PatientDashboardAPI(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != 'patient':
            return Response(
                {"error": "Only patients can access this dashboard."},
                status=403
            )

        if not hasattr(request.user, 'patient_profile'):
            return Response(
                {"error": "Patient profile not found. Please complete your registration."},
                status=404
            )

        patient = request.user.patient_profile

        appointments = Appointment.objects.filter(
            patient=patient
        )

        # Recent appointments for timeline
        recent_appointments = Appointment.objects.select_related(
            'doctor', 'patient', 'doctor__user', 'patient__user'
        ).filter(
            patient=patient
        ).order_by('-appointment_date')[:5]

        data = {

            "upcoming_appointments":
                appointments.filter(
                    status='scheduled'
                ).count(),

            "completed_appointments":
                appointments.filter(
                    status='completed'
                ).count(),

            "cancelled_appointments":
                appointments.filter(
                    status='cancelled'
                ).count(),

            "total_reports":
                Report.objects.filter(
                    appointment__patient=patient
                ).count(),

            "total_prescriptions":
                Prescription.objects.filter(
                    appointment__patient=patient
                ).count(),

            "recent_appointments":
                AppointmentSerializer(recent_appointments, many=True).data,
        }

        return Response(data)