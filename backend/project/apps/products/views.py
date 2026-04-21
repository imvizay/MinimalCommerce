

from rest_framework.viewsets import ModelViewSet,ReadOnlyModelViewSet

from django_filters.rest_framework import DjangoFilterBackend 
from rest_framework.filters import SearchFilter,OrderingFilter

from .filters import ProductFilter 

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
   
    
    def get_queryset(self):
        qs = super().get_queryset()
        
        # params
        cat_id = self.request.GET.get('category')
        ordering = self.request.GET.get('ordering')
        has_sort = self.request.GET.get('sort') 
        min_price = self.request.GET.get('min_price')

        if cat_id:
            qs = qs.filter(category__id=cat_id)

        if min_price:
            qs = qs.filter(pro_price__gte=min_price)

        if has_sort:
           allowed_ordering = ['pro_price',"-pro_price"]
           if ordering in allowed_ordering:
             qs = qs.order_by(ordering)
        
        return qs

   

