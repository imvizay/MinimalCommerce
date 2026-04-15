from .models import Order,OrderItem
from apps.products.models import ProductVariant

from django.db import transaction


# Create Order 
def create_order(user,items):
    print("+=====================================+")
    print("User:",user)
    print("-=====================================-")

    with transaction.atomic():
        order = Order.objects.create(user=user)
        total_price = 0

        for item in items:
            variant = ProductVariant.objects.select_for_update().get(id=item['variant_id'])
            quantity = item['quantity']
            
            if quantity > variant.stock:
                raise Exception("Out of stock.")

            variant.stock -= quantity
            variant.save()
            price = variant.product.pro_price * int(quantity)
            total_price += price

            OrderItem.objects.create(
                order = order,
                variant = variant,
                quantity = quantity,
                price = price
            )
        
        order.total +=total_price
        order.save()

        return order