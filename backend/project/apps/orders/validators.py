
from decimal import Decimal,InvalidOperation
from rest_framework.exceptions import ValidationError

from apps.products.models import Product , ProductVariant

def order_validation(payload):

    print(f"VALIDATOR :{payload}")
    order  = payload.get('items',[])


    if not order:
        raise ValidationError("No order found.")
    
    for ordered_item in order:

        ordered_variant_id = None

        if ordered_item.get('variant_id',None):
             ordered_variant_id = ordered_item['variant_id']

        ordered_item_id = ordered_item['id']
        ordered_item_quantity = ordered_item['quantity']

        if ordered_item_quantity < 1 or ordered_item_quantity > 10:
                raise ValidationError({'error':'"You can buy only 1–10 units per product'})  

        # Product without variants
        if ordered_variant_id is None:
            exists = Product.objects.filter(id=ordered_item_id).exists()

            if not exists:
                raise ValidationError({'error':f'product {ordered_item_id} not found'})

        # Product with variants
        else :
             
            variant = ProductVariant.objects.filter(id=ordered_variant_id).exists()

            if not variant:
                 raise ValidationError({'error':f'variant {ordered_variant_id} not found'})
            
            if variant.product.id != ordered_item_id:
                 raise ValidationError({'error':'irrelevant variant to the product'})
            

    return payload
             

           




        

   
    








