

from rest_framework.viewsets import ModelViewSet,ReadOnlyModelViewSet

# products apps serializers models
from .serializers import (
                    ProductSerializer ,
                    CategorySerializer , 
                    ProductsListSerializer )
# products apps models
from .models import Product,Category

# Views...

class CategoryView(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

# Crud view for amdin to manage products 
class ProductView(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


# Read only products for users.
class ListProducts(ReadOnlyModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductsListSerializer