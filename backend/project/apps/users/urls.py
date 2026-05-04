
from django.urls import path
from .views import RegisterUserView 
from .routers import router

urlpatterns = [
    path('register/',RegisterUserView.as_view())
]
urlpatterns += router.urls