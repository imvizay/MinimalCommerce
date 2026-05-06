
import razorpay
from django.conf import settings

from decimal import Decimal
from django.db import transaction


from .models import Order,OrderItem
from apps.products.models import Product
from django.db import transaction
from apps.payments.models import PaymentStatus 

from apps.cart.models import Cart
# payment apps
from apps.payments.services import create_payment

def create_order(user, data):

    client = razorpay.Client(
        auth=(settings.RAZORPAY_PUBLIC_KEY, settings.RAZORPAY_SECRET_KEY)
    )

    checkout_id = data['checkout_id']

    

    with transaction.atomic():
        print("Starting Order Creation Transtaction :")
        print(" ++++++++++++++++++++++++++++++++++ :")  

        total = Decimal("0.00")
        order_items = []

        # Get or create order
        order = Order.objects.select_for_update().filter(
            user=user,
            checkout_id=checkout_id
        ).first()

        payment = getattr(order, 'payment', None)

        if payment and payment.status == PaymentStatus.SUCCESS:
            return {
                'status': 'PAID',
                'message': 'Payment already completed',
                'razorpay_payment_id': payment.provider_payment_id
            }

        # ALWAYS safe
        cart, _ = Cart.objects.prefetch_related("user_cart__product").get_or_create(user=user)

        cart_items = cart.user_cart.all()

        if not cart_items.exists():
            return {"error": "Cart is empty"}

        # Calculate total safely
        for item in cart_items:
            price = Decimal(item.product.pro_price)
            qty = Decimal(item.quantity)

            line_total = price * qty
            total += line_total

            order_items.append({
                "product": item.product,
                "quantity": item.quantity,
                "price": price
            })

        print("FINAL TOTAL:", total)

        # Create or update order
        if not order:
            order = Order.objects.create(
                user=user,
                total=total,
                checkout_id=checkout_id,
                order_status="pending"
            )
        else:
            order.order_items.all().delete()
            order.total = total
            order.save()

        # Create order items
        for item in order_items:
            OrderItem.objects.create(
                order=order,
                product=item['product'],  
                quantity=item['quantity'],
                price=item['price']
            )

        # Handle existing pending payment
        if payment and payment.status == PaymentStatus.PENDING:
            return {
                'status': 'PENDING',
                'message': 'Payment already initiated',
                'razorpay_order_id': payment.provider_order_id,
                'amount': int(payment.amount * 100),
                'currency': 'INR'
            }

        # Create payment record
        payment = create_payment(
            user=user,
            order=order,
            amount=total,
            currency="INR",
            status=PaymentStatus.PENDING,
        )

        # Razorpay order creation
        razorpay_order = client.order.create({
            "amount": int(total * 100),   # paise
            "currency": "INR",
            "payment_capture": 1
        })

        payment.provider_order_id = razorpay_order['id']
        payment.save()

        return {
            'razorpay_order_id': razorpay_order['id'],
            'amount': razorpay_order['amount'],
            'currency': razorpay_order['currency']
        }