
from rest_framework.generics import ListCreateAPIView
from rest_framework.viewsets import ModelViewSet

from .models import Member
from .serializers import MemberSerializer
from .paginations import AdminUserListPagination



class RegisterUserView(ListCreateAPIView):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer


class Users(ModelViewSet):
    queryset = Member.objects.all().order_by('-id')
    serializer_class = MemberSerializer
    pagination_class = AdminUserListPagination
