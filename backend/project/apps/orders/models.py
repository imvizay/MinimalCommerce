from django.db import models
from django.contrib.auth import get_user_model 
from apps.products.models import ProductVariant,Product
# Create your models here.

Member = get_user_model() 
class Order(models.Model):
    """
    User Order Summary Model To Store The User Specific Orders.
    """

    user = models.ForeignKey(Member, 
                             on_delete = models.CASCADE, 
                             related_name = 'orders')
    
    order_status = models.CharField(max_length = 50,
                                    choices = [
                                    ('pending','pending'),
                                    ('confirmed','confirmed'),
                                    ('shipped',"shipped"),
                                    ('delivered','delivered'),
                                    ('cancelled','cancelled'),],default="pending"
                                )
    total = models.DecimalField(max_digits = 10, decimal_places = 2, default = 0)
    checkout_id = models.UUIDField(db_index=True)

    def __str__(self):
        return f"Order created by {self.user.email.split('@')[:1]} - '{self.order_status}'"
    


class OrderItem(models.Model):
    """
    Specific Items Models To Manage The Items Seperately.
    """

    order = models.ForeignKey(Order,on_delete = models.CASCADE,related_name = 'order_items')
    product = models.ForeignKey(Product,on_delete=models.CASCADE)
    variant = models.ForeignKey(ProductVariant,on_delete = models.CASCADE,related_name = "variants",null=True)

    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits = 7,decimal_places = 2,blank = False,null = False)

    status = models.CharField(max_length = 100,
                              choices = [('pending','pending'), 
                                        ('cancelled','cancelled'), 
                                        ('confirmed','confirmed')],
                                        default='pending'
                            )