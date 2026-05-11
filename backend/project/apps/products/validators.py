from decimal import Decimal,InvalidOperation
from rest_framework.exceptions import ValidationError

def validate_product_creation(data):

    errors = {}
    product_name = data.get('pro_name')
    product_price = data.get('pro_price')
    
    # --- Product Name Validation ---
    if not product_name:
        errors["product_name"] = "cannot be empty"
    else:
        product_name = product_name.strip()
        if len (product_name) < 5 or len(product_name) > 100:
            errors['product_name'] = 'product name should be in between 5 - 100 character'

    
    # --- Price Validation ---
    if product_price in [None,""]:
        errors['product_price'] = "cannot be empty"
    else:
        try:
            price = Decimal(product_price)
            if price <=0:
                errors['product_price'] = 'price must be a positive number and greater than 0'

            if price > Decimal('1000000'):
                errors['product_price'] = 'price too large'

            if price.as_tuple().exponent < -2:
                errors['product_price'] = 'only two decimals allowed in price'
        
        except (InvalidOperation,TypeError):
            errors['product_price'] = 'invalid price format'

    # final check
    if errors:
        raise ValidationError(errors)
    
    # if valid return validated_data.
    return data

from rest_framework.exceptions import ValidationError

def bulkcreate_product_validation(csv_file, zip_file):

    if not csv_file:
        raise ValidationError({
            "csv_file": "CSV file not provided"
        })

    if not zip_file:
        raise ValidationError({
            "zip_file": "ZIP file not provided"
        })

    if not csv_file.name.endswith(".csv"):
        raise ValidationError({
            "csv_file": "Invalid CSV file format"
        })

    if not zip_file.name.endswith(".zip"):
        raise ValidationError({
            "zip_file": "Invalid ZIP file format"
        })
    
    if csv_file.size == 0:
        raise ValidationError({
            "csv_file": "CSV file is empty"
        })

    if zip_file.size == 0:
        raise ValidationError({
            "zip_file": "ZIP file is empty"
        })
    

