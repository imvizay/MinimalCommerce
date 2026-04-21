from rest_framework.routers import DefaultRouter
from .views import ProductView,CategoryView,ListProducts
router = DefaultRouter()

router.register('admin',ProductView)
router.register('users',ListProducts,basename='user-products')

router.register('category',CategoryView)