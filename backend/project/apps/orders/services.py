from .models import Order,OrderItem
from apps.products.models import Product
from django.db import transaction
from apps.payments.models import PaymentStatus

# payment apps
from apps.payments.services import create_payment

import razorpay
from django.conf import settings


def create_order(user, data):

    client = razorpay.Client(
        auth=(settings.RAZORPAY_PUBLIC_KEY, settings.RAZORPAY_SECRET_KEY)
    )

    with transaction.atomic():

        order_items = []
        total = 0

        for item in data.get('items', []):
            product = Product.objects.select_for_update().get(id=item['id'])

            # stock validation
            
            total += product.pro_price * item['quantity']

            order_items.append({
                "product": product,
                "quantity": item['quantity'],
                "price": product.pro_price
            })

        # create order
        order = Order.objects.create(
            user=user,
            total=total,
            order_status="pending"
        )

        # create order items + reduce stock
        for item in order_items:
            OrderItem.objects.create(
                order=order,
                product=item['product'],
                quantity=item['quantity'],
                price=item['price'],
            )

            # reduce stock
           

        # create razorpay order
        razorpay_order = client.order.create({
            "amount": int(total * 100),
            "currency": "INR",
            "payment_capture": 1
        })

        # create payment
        payment = create_payment(
            user=user,
            order=order,
            amount=total,
            currency="INR",
            status=PaymentStatus.PENDING,  # better than CREATED
            provider_order_id=razorpay_order['id']
        )

        return {
            'razorpay_order_id': razorpay_order['id'],
            'amount': razorpay_order['amount'],
            'currency': razorpay_order['currency']
        }