from config.settings.base import *

import dj_database_url
from decouple import config

DATABASES = {
    "default": dj_database_url.config(
        default=config("DATABASE_URL")   
    )
}

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