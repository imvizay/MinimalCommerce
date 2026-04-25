
from django.urls import path
from .views import VerifyCartPayment

urlpatterns = [
    path('cart/verify-payment/',VerifyCartPayment.as_view()),
]