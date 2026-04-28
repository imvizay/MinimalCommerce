
from django.urls import path
from .views import VerifyCartPayment, LoadingPendingOrderPayments


urlpatterns = [
    path('cart/verify-payment/',VerifyCartPayment.as_view()),

    # userdashboard 
    path('pending-payments/',LoadingPendingOrderPayments.as_view())
]