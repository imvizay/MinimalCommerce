import uuid
from django.db import models
from django.contrib.auth import get_user_model
from apps.orders.models import Order

Member = get_user_model()


# Payment Status Choices

class PaymentStatus(models.TextChoices):
    CREATED = 'created', 'Created'
    PENDING = 'pending', 'Pending'
    SUCCESS = 'success', 'Success'
    FAILED = 'failed', 'Failed'
    REFUNDED = 'refunded', 'Refunded'


# Payment Model ( per order)

class Payment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    user = models.ForeignKey(Member, on_delete=models.CASCADE)

    order = models.OneToOneField(
        Order,
        on_delete=models.CASCADE,
        related_name='payment'
    )

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=20, default='INR')

    status = models.CharField(
        max_length=20,
        choices=PaymentStatus.choices,
        default=PaymentStatus.CREATED
    )

    is_paid = models.BooleanField(default=False)
    paid_at = models.DateTimeField(null=True, blank=True)

    provider = models.CharField(max_length=50, default='razorpay')

    provider_order_id = models.CharField(max_length=255, null=True, blank=True)
    provider_payment_id = models.CharField(max_length=255, null=True, blank=True)

    payment_method = models.CharField(max_length=50, null=True, blank=True)

    failure_reason = models.TextField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment {self.id} - {self.status}"


# Payment Attempt Model (Retries)
class PaymentAttempt(models.Model):
    payment = models.ForeignKey(
        Payment,
        on_delete=models.CASCADE,
        related_name='attempts'
    )

    attempt_number = models.PositiveIntegerField()

    status = models.CharField(
        max_length=20,
        choices=[
            ('initiated', 'Initiated'),
            ('success', 'Success'),
            ('failed', 'Failed'),
        ]
    )

    provider_payment_id = models.CharField(max_length=255, null=True, blank=True)

    error_code = models.CharField(max_length=100, null=True, blank=True)
    error_message = models.TextField(null=True, blank=True)

    raw_response = models.JSONField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('payment', 'attempt_number')
        ordering = ['-created_at']

    def __str__(self):
        return f"Attempt {self.attempt_number} - {self.status}"