from django.shortcuts import render
from rest_framework.decorators import api_view
from .models import User
from .serializers import AccountSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

# Create your views here.

#--------------------FUNCTION BASED VIEWS------------------------
#This is responsible for user registration
# @api_view(['POST'])
# def register(request):
#     serializer = AccountSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#--------------------CLASS BASED VIEWS------------------------
# class AccountAPI(generics.GenericAPIView, mixins.CreateModelMixin):
#     serializer_class = AccountSerializer

#     def post(self, request, *args, **kwargs):
#         return self.create(request, *args, **kwargs)

#---------------------------------------API VIEW---------------------------------------



#Account registration using APIView
class AccountAPI(APIView):
    def post(self, request):
        serializer = AccountSerializer(data=request.data)
             # “Take the incoming data from the client and pass it to the serializer for validation and conversion.”
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

#Account update using APIView
class AccountUpdateAPI(APIView):
    def put(self, request, pk):
        user=User.objects.get(pk=pk)
        serializer = AccountSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, pk):
        user = User.objects.get(pk=pk)
        serializer = AccountSerializer(user,data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        
#Password change using APIView 
class ChangePasswordAPI(APIView):
    def post(self, request, pk):
        user = User.objects.get(pk=pk)

        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        if not user.check_password(old_password):
            return Response({"error": "Old password is incorrect"},status=status.HTTP_400_BAD_REQUEST)
        
        
        user.set_password(new_password)
        user.save()
        return Response({"message": "Password changed successfully"},status=status.HTTP_200_OK)
    
#-------------------------------------------------------------------------------------------------  
#Current user API to get details of currently logged in user
from rest_framework.permissions import IsAuthenticated

class CurrentUserAPI(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        return Response({
            "id": request.user.id,
            "username": request.user.username,
            "email": request.user.email,
            "role": request.user.role,
            "first_name": request.user.first_name,
            "last_name": request.user.last_name,
            "phone": request.user.phone
        })