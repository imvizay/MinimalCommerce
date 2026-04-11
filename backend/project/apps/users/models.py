from django.contrib.auth.models import AbstractUser,BaseUserManager
from django.db import models


class Basic(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class MemberManager(BaseUserManager):

    def create_user(self, email , password = None,**kwargs):
        if not email:
            raise ValueError("email is required")
    
        email = self.normalize_email(email)
        user = self.model(email=email,**kwargs)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self,email,password=None,**kwargs):
        kwargs.setdefault("is_staff",True)
        kwargs.setdefault("is_superuser",True)
        return self.create_user(email,password,**kwargs)



class Member(AbstractUser, Basic):
    username = None
    email = models.EmailField(unique=True)
    contact = models.CharField(max_length=12)
    address = models.TextField()

    objects = MemberManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"Member - {self.email}"