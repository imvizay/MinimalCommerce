from rest_framework.routers import DefaultRouter
from .views import UserCartView
router = DefaultRouter()

router.register('items',UserCartView,basename="cart")

