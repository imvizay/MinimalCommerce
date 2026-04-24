from django.urls import path
from .views import CreateCartOrderView 
urlpatterns = [
    path('cart-checkout/create-order/',CreateCartOrderView.as_view()),
]