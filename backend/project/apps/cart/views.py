from django.shortcuts import render , get_object_or_404

# Create your views here.
from rest_framework.viewsets import ModelViewSet
from .models import Cart,CartItem
from apps.products.models import Product,ProductVariant
from .serializers import UserCartSerializer

from rest_framework.decorators import action
from rest_framework.response import Response

class UserCartView(ModelViewSet):
    serializer_class = UserCartSerializer

    def get_queryset(self):
        return Cart.objects.none()
    
    # fetch cart items
    @action(detail=False, methods=['get'])
    def load_cart(self, request):

        cart = Cart.objects.filter(user=request.user).prefetch_related(
            'user_cart__product',
            'user_cart__variant'
        ).first()

        if not cart:
            return Response({"cart_items": []})

        serializer = self.get_serializer(cart)
        return Response(serializer.data)
    
    # create cart
    @action(detail=False,methods=['post'])
    def add_item(self, request):
        product_id = request.data.get('product_id')
        variant_id = request.data.get('variant_id')
        quantity = request.data.get('quantity',1)
        
        # if existing cart
        cart,_ = Cart.objects.get_or_create(user = request.user)

        # clamp quantity
        quantity = max(1,min(quantity,10))

        if not product_id:
            return Response({'message':'Product required'},status=400)

        product = get_object_or_404(Product,id=product_id)

        variant = None
        if variant_id:
            variant = get_object_or_404(ProductVariant, id=variant_id)

        # GET or CREATE cart

        cart,_ = Cart.objects.get_or_create(user=request.user)

        # Get existing items
        item = CartItem.objects.filter(cart=cart,product=product,variant=variant).first()

        if item:
            item.quantity = min(item.quantity + quantity, 10 )
            item.save()

            return Response({
                "message": "Cart updated",
                "item_id": item.id,
                "quantity": item.quantity
            },status=200)
        

        # Create new item
        item = CartItem.objects.create(
            cart=cart,
            product=product,
            variant=variant,
            quantity=quantity
        )

        return Response({
            "message": "Item added to cart",
            "item_id": item.id,
            "quantity": item.quantity
        }, status=201)
    

    @action(detail=True,methods=['delete'])
    def remove_item(self,request,pk=None):
        print(pk) # id
        item = CartItem.objects.get(id=pk)
        item.delete()

        return Response({'message':f'item removed form cart - {pk}'},status=200)
        
    @action(detail=True,methods=['patch'])
    def update_cart(self,request,pk=None):
        qty = request.data.get('quantity',1)

        print("PK:",pk)
        print("QUANTITY:",qty)
        item = CartItem.objects.get(id=pk)

        if item:
            item.quantity = qty
            item.save()

        print("ITEM QUANITY ",item.quantity)

        return Response({'message':f'quantity updated for item id - {item.id}'},status=200)

    



