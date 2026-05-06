
from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static

# products routers 
from apps.products.routers import router as product_router
from apps.cart.routers import router as cart_router

# cart view
from apps.cart.views import UserCartView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # cart 
    path('api/cart/',include(cart_router.urls)),

    # user routes
    path('api/products/',include(product_router.urls)),
    path('api/',include('apps.orders.urls')),
    path('api/auth/',include('apps.jwt_auth.urls')),
    path('api/users/',include('apps.users.urls')),
    path('api/payments/',include('apps.payments.urls')),

    # usersdashboard api 
    path('api/userdashboard/',include('apps.orders.urls')),
    path('api/userdashboard/',include('apps.payments.urls')),

    # admin
    path('api/admin/',include('apps.orders.urls'))

] + static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)
