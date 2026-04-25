
from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static

# products routers 
from apps.products.routers import router

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/products/',include(router.urls)),
    path('api/',include('apps.orders.urls')),
    path('api/auth/',include('apps.jwt_auth.urls')),
    path('api/users/',include('apps.users.urls')),
    path('api/payments/',include('apps.payments.urls'))
] + static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)
