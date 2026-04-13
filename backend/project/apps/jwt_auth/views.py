from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate


# services
from .services import login_user

class LoginView(APIView):

    def get(self, request):
     return Response({
        "message": "Use POST method to login"
    })

    def post(self,request):
        email = request.data.get("email",None)
        password = request.data.get("password",None)

        # minimal validation
        if not email or not password:
            return Response({
                "detail":"email and password are required"
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            data_and_tokens = login_user(email,password)

            return Response({
                'message':'Login successfull',
                **data_and_tokens,
            }, status = status.HTTP_200_OK)
        
        except ValueError as e:
            return Response({"error":str(e)}, status = 401)
            


    

