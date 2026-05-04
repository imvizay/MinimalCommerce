from rest_framework.routers import DefaultRouter
from .views import Users
router = DefaultRouter()

router.register(r'admin',Users,basename='users')

