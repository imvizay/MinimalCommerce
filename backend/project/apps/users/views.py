from django.shortcuts import render
from rest_framework.generics import ListCreateAPIView

from .models import Member
from .serializers import MemberSerializer


class RegisterUserView(ListCreateAPIView):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer