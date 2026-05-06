from .models import Cart , CartItem
from rest_framework import serializers


from rest_framework import serializers

class CartItemSerializer(serializers.ModelSerializer):
    pro_price = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()
    preview_image = serializers.SerializerMethodField()
    product_name = serializers.SerializerMethodField()


    class Meta:
        model = CartItem
        fields = [
            'id',
            'product',
            'variant',
            'quantity',
            'pro_price',
            'total_price',
            "product_name",
            'preview_image'
        ]

    def get_pro_price(self, obj):
        if obj.variant:
            return obj.variant.price
        return obj.product.pro_price

    def get_total_price(self, obj):
        price = obj.variant.price if obj.variant else obj.product.pro_price
        return price * obj.quantity
    
    def get_product_name(self,obj):
        return obj.product.pro_name
    

    def get_preview_image(self, obj):
        request = self.context.get("request")

        image_obj = obj.product.images.first()  

        if not image_obj:
            return None

        image_url = image_obj.image.url

        # full URL 
        return request.build_absolute_uri(image_url) if request else image_url


class UserCartSerializer(serializers.ModelSerializer):
    cart_items = CartItemSerializer(source="user_cart", many=True, read_only=True)
    cart_total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'user', 'cart_items', 'cart_total', 'created_at']

    def get_cart_total(self, obj):
        total = 0
        for item in obj.user_cart.all():
            price = item.product.pro_price
            total += price * item.quantity
        return total