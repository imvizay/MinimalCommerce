from rest_framework.routers import DefaultRouter
from .views import ProductView,CategoryView,ListProducts
router = DefaultRouter()

router.register('admin',ProductView)
router.register('categories',CategoryView)
router.register('list',ListProducts,basename='user-products')

