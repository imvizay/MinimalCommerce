from config.settings.base import *

DEBUG = False

CORS_ALLOWED_ORIGINS = [
    'https://minimalcommerce.vercel.app'
]

ALLOWED_HOSTS = [
    "minimalcommerce.onrender.com",
]
CSRF_TRUSTED_ORIGINS = [
    "https://minimalcommerce.onrender.com",
]