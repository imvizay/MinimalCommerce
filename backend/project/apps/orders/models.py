from django.db import models
from django.contrib.auth import get_user_model 
from apps.products.models import ProductVariant,Product
# Create your models here.

Member = get_user_model()

class Order(models.Model):
    user = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='orders')

    order_status = models.CharField(
        max_length=50,
        choices=[
            ('pending','pending'),
            ('confirmed','confirmed'),
            ('partially_confirmed','partially_confirmed'),
            ('shipped',"shipped"),
            ('delivered','delivered'),
            ('cancelled','cancelled'),
        ],
        default="pending"
    )

    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    checkout_id = models.UUIDField(db_index=True)

    is_finalized = models.BooleanField(default=False)  # 🔥 IMPORTANT
    finalized_at = models.DateTimeField(null=True, blank=True)

    payment_id = models.CharField(max_length=255, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='order_items')

    product = models.ForeignKey(Product, on_delete=models.CASCADE,related_name='products')

    variant = models.ForeignKey(
        ProductVariant,
        on_delete=models.CASCADE,
        related_name="order_items",
        null=True,
        blank=True
    )

    quantity = models.PositiveIntegerField()

    price = models.DecimalField(max_digits=7, decimal_places=2)

    status = models.CharField(
        max_length=100,
        choices=[
            ('pending','pending'),
            ('confirmed','confirmed'),
            ('cancelled','cancelled'),
            ('shipped','shipped'),
            ('delivered','delivered'),
        ],
        default='pending'
    )

    class Meta:
        unique_together = ('order', 'product', 'variant')