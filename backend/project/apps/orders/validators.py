
from decimal import Decimal,InvalidOperation
from rest_framework.exceptions import ValidationError


def order_validation(order):

    items  = order.get('items',[])
    if not items:
        raise ValidationError("Order must contain atleast one item")

    for item in items:
        variant_id = item.get('variant_id')
        quantity = item.get('quantity')
        seen = set()

        # check missing fields
        if variant_id is None:
            raise ValidationError("variant id is required")
        
        if quantity is None:
            raise ValidationError("quantity is required")
        
        if variant_id in seen:
            raise ValidationError(f'Duplicate variant - {variant_id}')
        
        seen.add(variant_id)
    return order








