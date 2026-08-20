from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import DoctorProfile
from .serializers import DoctorProfileSerializer
from accounts.models import User
# Create your views here.

class DoctorProfileAPI(APIView):

    # GET /doctors/profile/
    # GET /doctors/profile/1/
    def get(self, request, pk=None):
        if pk is not None:
            try:
                doctor_profile = DoctorProfile.objects.get(pk=pk)
                serializer = DoctorProfileSerializer(doctor_profile)
                return Response(serializer.data,status=status.HTTP_200_OK)
            except DoctorProfile.DoesNotExist:
                return Response({"error": "Doctor profile not found."},status=status.HTTP_404_NOT_FOUND)
            
        doctors = DoctorProfile.objects.all()
        serializer = DoctorProfileSerializer(doctors,many=True)

        return Response(serializer.data,status=status.HTTP_200_OK)

    # POST /doctors/profile/
    def post(self, request):
        serializer = DoctorProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

    # PATCH /doctors/profile/1/
    def patch(self, request, pk):
        try:
            doctor_profile = DoctorProfile.objects.get(pk=pk)
        except DoctorProfile.DoesNotExist:
            return Response({"error": "Doctor profile not found."},status=status.HTTP_404_NOT_FOUND)

        serializer = DoctorProfileSerializer(doctor_profile,data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

    # DELETE /doctors/profile/1/
    def delete(self, request, pk):
        try:
            doctor_profile = DoctorProfile.objects.get(pk=pk)
        except DoctorProfile.DoesNotExist:
            return Response({"error": "Doctor profile not found."},status=status.HTTP_404_NOT_FOUND)
        doctor_profile.delete()
        return Response({"message": "Doctor profile deleted successfully."},status=status.HTTP_200_OK)


    
class DoctorLeaveAPI(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        if request.user.role != 'doctor':
            return Response({'error': 'Only doctors can add leaves'}, status=status.HTTP_403_FORBIDDEN)
        from .models import DoctorLeave
        DoctorLeave.objects.create(
            doctor=request.user.doctor_profile,
            start_date=request.data.get('start_date'),
            end_date=request.data.get('end_date'),
            reason=request.data.get('reason', '')
        )
        return Response({'message': 'Leave added'}, status=status.HTTP_201_CREATED)
