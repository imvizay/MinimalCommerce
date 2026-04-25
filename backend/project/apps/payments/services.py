
from .models import Payment , PaymentStatus
from django.utils import timezone


def create_payment(**data):
     return Payment.objects.create(**data)


def verify_and_update_payment(order_id, pay_id):

    payment = Payment.objects.get(provider_order_id=order_id)

    if payment is None:
        return {"message": "Payment not found", "status": "failed"}

    # Idempotency check 
    if payment.status == PaymentStatus.SUCCESS:
        return {"message": "Already verified", "status": "success"}

    try:
        # Update payment
        payment.status = PaymentStatus.SUCCESS
        payment.is_paid = True
        payment.provider_payment_id = pay_id
        payment.paid_at = timezone.now()
        payment.save()

        return {
            "message": "Payment verified successfully",
            "status": "success"
        }

    except Exception as e:
        payment.status = PaymentStatus.FAILED
        payment.failure_reason = str(e)
        payment.save()

        return {
            "message": "Payment update failed",
            "status": "failed"
        }