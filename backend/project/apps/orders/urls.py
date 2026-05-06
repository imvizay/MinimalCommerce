from django.urls import path
from .views import CreateCartOrderView , GetUserProducts  ,OrdersList , FinalizeOrder , GetOrderDetails
urlpatterns = [
    path('cart-checkout/create-order/',CreateCartOrderView.as_view()),

    # userdashboard endpoints
    path('my-orders/',GetUserProducts.as_view()),
    path('my-orders/<int:pk>/',GetOrderDetails.as_view()),


    # admin 
    path('orders/',OrdersList.as_view()),

    path('orders/finalize-order/',FinalizeOrder.as_view()),
]