from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Prescription, Appointment
from .serializers import PrescriptionSerializer
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsDoctor


class PrescriptionAPI(APIView):

    permission_classes = [IsAuthenticated]


    def get(self, request, pk=None):

        if request.user.role == 'doctor':

            prescriptions = Prescription.objects.select_related(
                'appointment',
                'appointment__doctor',
                'appointment__patient'
            ).filter(
                appointment__doctor=request.user.doctor_profile
            )

        elif request.user.role == 'patient':

            prescriptions = Prescription.objects.select_related(
                'appointment',
                'appointment__doctor',
                'appointment__patient'
            ).filter(
                appointment__patient=request.user.patient_profile
            )

        else:

            return Response(
                {"error": "Invalid role"},
                status=status.HTTP_403_FORBIDDEN
            )

        if pk:

            prescription = get_object_or_404(
                prescriptions,
                pk=pk
            )

            serializer = PrescriptionSerializer(
                prescription
            )

            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )

        serializer = PrescriptionSerializer(
            prescriptions,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


    def post(self, request):

        appointment_id = request.data.get('appointment')

        if not appointment_id:

            return Response(
                {
                    "error": "Appointment ID is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        appointment = get_object_or_404(
            Appointment.objects.filter(
                doctor=request.user.doctor_profile
            ),
            pk=appointment_id
        )

        if appointment.status != 'completed':
            return Response(
                {"error": "Prescriptions can only be created for completed appointments."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = PrescriptionSerializer(
            data=request.data
        )

        if serializer.is_valid():

            serializer.save(
                appointment=appointment
            )

            return Response(
                {
                    "message": "Prescription created successfully.",
                    "data": serializer.data
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def patch(self, request, pk):

        prescription = get_object_or_404(
            Prescription.objects.filter(
                appointment__doctor=request.user.doctor_profile
            ),
            pk=pk
        )

        serializer = PrescriptionSerializer(
            prescription,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():

            serializer.save()

            return Response(
                {
                    "message": "Prescription updated successfully.",
                    "data": serializer.data
                },
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, pk):

        prescription = get_object_or_404(
            Prescription.objects.filter(
                appointment__doctor=request.user.doctor_profile
            ),
            pk=pk
        )

        prescription.delete()

        return Response(
            {
                "message": "Prescription deleted successfully."
            },
            status=status.HTTP_200_OK
        )