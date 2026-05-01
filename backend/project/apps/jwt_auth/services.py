
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken


def login_user(email,password):

    # authenticate user
    user = authenticate( email = email, password = password )
    
    if not user:
        return Response(
            { 'detail' : 'invalid credentials' },
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    if not user.is_active:
        return Response(
            { 'detail' : 'Inactive user' }, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Generate token for authenticate user
    refresh = RefreshToken.for_user(user)
   
    return {
        "user":{
            "id":user.id,
            "email":user.email,
            "contact":user.contact,
            "address":user.address,
            "is_superuser":user.is_superuser
        },
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }
     