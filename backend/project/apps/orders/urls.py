from django.urls import path
from .views import CreateCartOrderView , GetUserProducts  ,OrdersList , FinalizeOrder
urlpatterns = [
    path('cart-checkout/create-order/',CreateCartOrderView.as_view()),

    # userdashboard endpoints
    path('my-orders/',GetUserProducts.as_view()),

    # admin 
    path('orders/',OrdersList.as_view()),
    path('orders/finalize-order/',FinalizeOrder.as_view()),

]