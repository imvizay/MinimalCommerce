from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()
# Create your models here.

from apps.products.models import ( Product, ProductVariant )


class Cart(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE,related_name="cart")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.email}'
    
class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='user_cart')
    product = models.ForeignKey(Product, on_delete=models.CASCADE,related_name="items")
    variant = models.ForeignKey(ProductVariant, null=True, blank=True, on_delete=models.SET_NULL)
    
    quantity = models.PositiveIntegerField(default=1)