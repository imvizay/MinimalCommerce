from django.urls import path

# view to authenticte users login credentials.
from apps.jwt_auth.views import LoginView

urlpatterns = [
    path('login/',LoginView.as_view())
]