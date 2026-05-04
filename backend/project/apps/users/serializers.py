from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from .models import Member

from .validators import validate_signup_data

class MemberSerializer(ModelSerializer): 

    confirm_password  = serializers.CharField(write_only=True)

    def validate(self, data):
        return validate_signup_data(data)
    
    class Meta:
        model = Member
        fields = ['id','email', 'contact', 'address','is_active', 'password', 'confirm_password' ]
        extra_kwargs = {
            'password':{'write_only':True},
            'id':{'read_only':True},
            'is_active':{'read_only':True}
        }

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        return Member.objects.create_user(**validated_data)


        