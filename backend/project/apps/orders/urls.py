from django.urls import path
from .views import CreateCartOrderView , GetUserProducts 
urlpatterns = [
    path('cart-checkout/create-order/',CreateCartOrderView.as_view()),

    # userdashboard endpoints
    path('my-orders/',GetUserProducts.as_view()),
]