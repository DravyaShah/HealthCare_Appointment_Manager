from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Report, Appointment
from .serializers import ReportSerializer
from rest_framework.parsers import MultiPartParser, FormParser

from rest_framework.permissions import IsAuthenticated

from accounts.permissions import IsDoctor


class ReportAPI(APIView):

    parser_classes = [MultiPartParser, FormParser]

    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):

        if request.user.role == 'doctor':

            reports = Report.objects.select_related(
                'appointment',
                'appointment__doctor',
                'appointment__patient'
            ).filter(
                appointment__doctor=request.user.doctor_profile
            )

        elif request.user.role == 'patient':
            reports = Report.objects.select_related(
                'appointment',
                'appointment__doctor',
                'appointment__patient'
            ).filter(
                appointment__patient=request.user.patient_profile
            )

        else:

            return Response({"error": "Invalid role"},status=status.HTTP_403_FORBIDDEN)

        if pk:

            report = get_object_or_404(reports,pk=pk)
            serializer = ReportSerializer(report, context={'request': request})
            return Response(serializer.data,status=status.HTTP_200_OK)

        serializer = ReportSerializer(reports, many=True, context={'request': request})

        return Response(serializer.data,status=status.HTTP_200_OK)


    def post(self, request):

        if request.user.role != 'doctor':
            return Response(
                {"error": "Only doctors can perform this action."},
                status=status.HTTP_403_FORBIDDEN
            )

        appointment_id = request.data.get('appointment')

        appointment = get_object_or_404(
            Appointment.objects.filter(
                doctor=request.user.doctor_profile
            ),
            pk=appointment_id
        )

        if appointment.status != 'completed':
            return Response(
                {"error": "Reports can only be uploaded for completed appointments."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ReportSerializer(
            data=request.data,
            context={'request': request}
        )

        if serializer.is_valid():

            serializer.save(
                appointment=appointment
            )

            return Response(
                {
                    "message": "Report uploaded successfully.",
                    "data": serializer.data
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def patch(self, request, pk):

        if request.user.role != 'doctor':
            return Response(
                {"error": "Only doctors can perform this action."},
                status=status.HTTP_403_FORBIDDEN
            )

        report = get_object_or_404(
            Report.objects.filter(
                appointment__doctor=request.user.doctor_profile
            ),
            pk=pk
        )

        serializer = ReportSerializer(
            report,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():

            serializer.save()

            return Response(
                {
                    "message": "Report updated successfully.",
                    "data": serializer.data
                },
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


    def delete(self, request, pk):
        if request.user.role != 'doctor':
            return Response(
                {"error": "Only doctors can perform this action."},
                status=status.HTTP_403_FORBIDDEN
            )

        report = get_object_or_404(Report.objects.filter(appointment__doctor=request.user.doctor_profile),pk=pk)
        report.delete()
        return Response({"message":"Report deleted successfully."},status=status.HTTP_200_OK)
