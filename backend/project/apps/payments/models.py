from django.db import models
from django.contrib.auth import get_user_model
from apps.orders.models import Order

Member = get_user_model()
# Views ...
PAYMENT_STATUS = [
    ('created',"Created"),
    ('success','Success'),
    ('pending','pending'),
    ('failed','failed'),
    ('refunded','refunded')
] 

class PaymentModal(models.Model):
    user = models.ForeignKey(Member,on_delete=models.CASCADE)
    order = models.OneToOneField(Order,on_delete=models.CASCADE,related_name='payments')
    status = models.CharField(max_length=50,
                              choices=PAYMENT_STATUS, default='created')
    
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    currency = models.CharField(max_length=20,default='INR')
    payment_method = models.CharField(max_length=20,blank=True,null=True)

    provider = models.CharField(max_length=20,default='razorpay')
    provider_payment_id = models.CharField(max_length=255,blank=True,null=True)
    provider_order_id = models.CharField(max_length=255,blank=True,null=True)

    failure_reason = models.TextField(blank=True,null=True)
    attempt_number = models.PositiveIntegerField(default=1)
    is_latest = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    
