# Razorpay 
import razorpay
from django.conf import settings

# Rest Framework views and serializers
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import CreateCartOrderInputSerializer

# Services
from .services import create_order 

from django.shortcuts import render

# ....... VIEWS.......



class CreateCartOrderView(APIView):
    "Order creation for user cart items."
    def post(self,request):
        print(f"VIEWS : {request.data}")
        user = request.user
        if not user:
            return Response({'message':'invalid user'},status=400)
        
        serializer = CreateCartOrderInputSerializer(data=request.data)    
        if not serializer.is_valid():
            return Response(serializer.errors,status=400)
    
        validated_data = serializer.validated_data
        order = create_order(user,validated_data) # Create Razorpay Order

        return Response(order,status=201) 
        
