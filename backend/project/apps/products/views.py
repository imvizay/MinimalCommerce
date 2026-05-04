

from rest_framework.viewsets import ModelViewSet,ReadOnlyModelViewSet

from .paginations import ProductsPagination

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
    queryset = Product.objects.all().order_by('-id')
    serializer_class = ProductSerializer
    pagination_class = ProductsPagination


# Read only products for users.
class ListProducts(ReadOnlyModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductsListSerializer

    def get_queryset(self):

        qs = super().get_queryset()
        # query filters
        category = self.request.query_params.get('category')
        price = self.request.query_params.get('min_price')
        order = self.request.query_params.get('order')


        # category filter
        if category:
            qs = qs.filter(category__id=category)

        # min price filter
        if price:
            qs = qs.filter(pro_price__gte=price)

        # return sorted products when sorting is asked by client.
        allowed_order = ['pro_price','-pro_price']
        if order:
            if order in allowed_order:
                qs = qs.order_by(order)
                return qs

        # latest product first
        else:
            return qs.order_by('-id')

        
        

        


