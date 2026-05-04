
from django.urls import path
from .views import VerifyCartPayment, LoadingPendingOrderPayments , ViewAllPayments

urlpatterns = [
    path('cart/verify-payment/',VerifyCartPayment.as_view()),

    # userdashboard 
    path('pending-payments/',LoadingPendingOrderPayments.as_view()),

    # admin
    path('all/',ViewAllPayments.as_view(),)
]