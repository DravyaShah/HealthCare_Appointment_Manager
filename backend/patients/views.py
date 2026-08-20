from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import PatientProfile
from .serializers import PatientProfileSerializer
from accounts.models import User

# Create your views here.
class PatientProfileAPI(APIView):

    # GET /patients/profile/
    # GET /patients/profile/1/
    def get(self, request, pk=None):
        if pk is not None:
            try:
                patient_profile = PatientProfile.objects.get(pk=pk)
                serializer = PatientProfileSerializer(patient_profile)
                return Response(serializer.data,status=status.HTTP_200_OK)
            except PatientProfile.DoesNotExist:
                return Response({"error": "Patient profile not found."},status=status.HTTP_404_NOT_FOUND)

        patients = PatientProfile.objects.all()
        serializer = PatientProfileSerializer(patients,many=True)

        return Response(serializer.data,status=status.HTTP_200_OK)

    # POST /patients/profile/
    def post(self, request):
        serializer = PatientProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

    # PATCH /patients/profile/1/
    def patch(self, request, pk):
        try:
            patient_profile = PatientProfile.objects.get(pk=pk)
        except PatientProfile.DoesNotExist:
            return Response({"error": "Patient profile not found."},status=status.HTTP_404_NOT_FOUND)

        serializer = PatientProfileSerializer(patient_profile,data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

    # DELETE /patients/profile/1/
    def delete(self, request, pk):
        try:
            patient_profile = PatientProfile.objects.get(pk=pk)
        except PatientProfile.DoesNotExist:
            return Response({"error": "Patient profile not found."},status=status.HTTP_404_NOT_FOUND)
        patient_profile.delete()
        return Response({"message": "Patient profile deleted successfully."},status=status.HTTP_200_OK)
