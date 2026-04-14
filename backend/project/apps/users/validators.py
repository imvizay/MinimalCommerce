
# Account Registration Validation 
from rest_framework.exceptions import ValidationError

def validate_signup_data(data):
    errors = {}

    email = data.get("email")
    password = data.get("password")
    confirm_password = data.get("confirm_password")
    contact = data.get("contact")

    # Email
    if not email:
        errors["email"] = "Email is required"
    elif not email.endswith("@gmail.com"):
        errors["email"] = "Invalid email format"

    # Password
    if not password:
        errors["password"] = "Password is required"
    else:
        if len(password) < 6:
            errors["password"] = "Min 6 chars"
        if len(password) > 16:
            errors["password"] = "Max 16 chars"

    # Confirm password
    if not confirm_password:
        errors["confirm_password"] = "Required"
    elif password != confirm_password:
        errors["confirm_password"] = "Passwords do not match"

    # Contact
    if not contact:
        errors["contact"] = "Required"
    else:
        contact = contact.strip()
        if not contact.isdigit():
            errors["contact"] = "Digits only"
        if not (10 <= len(contact) <= 15):
            errors["contact"] = "10-15 digits only"

    if errors:
        raise ValidationError(errors)

    return data