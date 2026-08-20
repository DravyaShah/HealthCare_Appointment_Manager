from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Appointment, DoctorProfile, PatientProfile
from .serializers import AppointmentSerializer
from rest_framework.permissions import IsAuthenticated


class AppointmentAPI(APIView):

    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can access appointments


    def get(self, request, pk=None):

        if request.user.role == 'doctor':
            appointments = Appointment.objects.select_related(
                'doctor',
                'patient'
            ).filter(
                doctor=request.user.doctor_profile
            )

        elif request.user.role == 'patient':
            appointments = Appointment.objects.select_related(
                'doctor',
                'patient'
            ).filter(
                patient=request.user.patient_profile
            )

        else:

            return Response(
                {"error": "Invalid role"},
                status=status.HTTP_403_FORBIDDEN
            )

        status_filter = request.query_params.get('status')

        valid_statuses = ['scheduled','completed','cancelled']
        


        if status_filter:
            if status_filter not in valid_statuses:
                return Response(
                    {"error": "Invalid status filter. Valid options are: scheduled, completed, cancelled."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            appointments = appointments.filter(
                status=status_filter
            )

        if pk:
            appointment = get_object_or_404(
                appointments,
                pk=pk
            )

            serializer = AppointmentSerializer(
                appointment
            )

            return Response(serializer.data)

        serializer = AppointmentSerializer(
            appointments,
            many=True
        )

        return Response(serializer.data)
            


    def post(self, request):

        if request.user.role != 'patient':

            return Response(
                {
                    "error": "Only patients can create appointments."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        doctor_id = request.data.get('doctor')

        if not doctor_id:

            return Response(
                {
                    "error": "Doctor ID is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        doctor = get_object_or_404(
            DoctorProfile,
            pk=doctor_id
        )

        serializer = AppointmentSerializer(
            data=request.data
        )

        if serializer.is_valid():

            serializer.save(
                doctor=doctor,
                patient=request.user.patient_profile
            )

            return Response(
                {
                    "message": "Appointment created successfully",
                    "data": serializer.data
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


    def patch(self, request, pk):

        if request.user.role == 'doctor':

            appointment = get_object_or_404(
                Appointment.objects.filter(
                    doctor=request.user.doctor_profile
                ),
                pk=pk
            )

        elif request.user.role == 'patient':

            appointment = get_object_or_404(
                Appointment.objects.filter(
                    patient=request.user.patient_profile
                ),
                pk=pk
            )

        else:

            return Response(
                {"error": "Invalid role"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        
        if appointment.status == 'cancelled':
            return Response(
                    {"error": "Cancelled appointments cannot be modified."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Only allow doctors to change status
        new_status = request.data.get('status')
        if new_status and request.user.role == 'patient':
            return Response(
                {"error": "Only doctors can update appointment status."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = AppointmentSerializer(
            appointment,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():

            serializer.save()

            return Response(
                {
                    "message": "Appointment updated successfully.",
                    "data": serializer.data
                },
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, pk):

        if request.user.role == 'doctor':

            appointment = get_object_or_404(
                Appointment.objects.filter(
                    doctor=request.user.doctor_profile
                ),
                pk=pk
            )

        elif request.user.role == 'patient':

            appointment = get_object_or_404(
                Appointment.objects.filter(
                    patient=request.user.patient_profile
                ),
                pk=pk
            )

        else:

            return Response(
                {"error": "Invalid role"},
                status=status.HTTP_403_FORBIDDEN
            )

        appointment.status = 'cancelled'
        appointment.save()

        return Response(
            {
                "message": "Appointment cancelled successfully."
            },
            status=status.HTTP_200_OK
        )
