from .models import Order,OrderItem
from apps.products.models import Product
from django.db import transaction
from apps.payments.models import PaymentStatus 

# payment apps
from apps.payments.services import create_payment

import razorpay
from django.conf import settings

# Checkout - user clicks for CHECKOUT this service will create a order entry in db.
def create_order(user, data):

    client = razorpay.Client(
        auth=(settings.RAZORPAY_PUBLIC_KEY, settings.RAZORPAY_SECRET_KEY)
    )
    checkout_id = data['checkout_id']

    with transaction.atomic():

        order_items = []
        total = 0

        # ---------- CHECK ORDER ----------------
        order = Order.objects.select_for_update().filter(
                        user = user, 
                        checkout_id=checkout_id 
                    ).first() # is order already exists
        

        # ----------- CHECK PAYMENT STATUS ----------------
        payment = getattr(order,'payment',None)

        # PAYMENT PAID
        if payment and payment.status == PaymentStatus.SUCCESS:

            return{
                'status': 'PAID',
                'message': 'Payment already completed',
                'razorpay_payment_id': payment.provider_payment_id
            }
        
        
        # calculate total price for order 
        for item in data.get('items', []):
            product = Product.objects.select_for_update().get(id=item['id'])

            # stock validation
            
            total += product.pro_price * item['quantity']

            order_items.append({
                "product": product,
                "quantity": item['quantity'],
                "price": product.pro_price
            })

        
        # create order instance if not already present in db
        if not order:
            order = Order.objects.create(
            user=user,
            total=total,
            checkout_id=checkout_id,
            order_status="pending"
        )
            

        # order already exists then clear old order items and create new as per the payload in order to avoid scenarios where user initiated for checkout but somehow payment got failed and he retries payment after changing cart items.
        else:
            # clear old items
            order.order_items.all().delete()
            order.total = total
            order.save()

        # create order items ( not updating stock here cause the payment status is PENDING. )
        for item in order_items:
            OrderItem.objects.create(
                order=order,
                product=item['product'],
                quantity=item['quantity'],
                price=item['price'],
            )

        # ---------- PAYMENT ------------------

        # PENDING - Initiated
        if payment and payment.status == PaymentStatus.PENDING:
            return{
                'status': 'PENDING',
                'message': 'Payment already initiated',
                'razorpay_order_id': payment.provider_order_id,
                'amount': int(payment.amount * 100),
                'currency': 'INR'
            }
        
        # create payment instance
        payment = create_payment(
                        user=user,
                        order=order,
                        amount=total,
                        currency="INR",
                        status=PaymentStatus.PENDING,  # better than CREATED
                    )
    
        try:
            # Razorpay order creation
            razorpay_order = client.order.create({
                "amount": int(total * 100),
                "currency": "INR",
                "payment_capture": 1
            })

        except Exception as e:
            print("Razorpay error",str(e))
            raise Exception("Payment Service unavailable")

        # update the razorpay order id as every reteries create new razorpay order 
        payment.provider_order_id = razorpay_order['id']
        payment.save()

        return {
            'razorpay_order_id': razorpay_order['id'],
            'amount': razorpay_order['amount'],
            'currency': razorpay_order['currency']
        }