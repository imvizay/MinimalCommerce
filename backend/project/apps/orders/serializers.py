
from .models import Order,OrderItem

from rest_framework import serializers
from apps.products.serializers import ProductsListSerializer


# INPUT Serializer

class OrderItemInputSerializer(serializers.Serializer):
    variant_id = serializers.IntegerField(required=False)
    quantity = serializers.IntegerField(min_value=1,max_value=10)
    id = serializers.IntegerField()


class CreateCartOrderInputSerializer(serializers.Serializer):
    checkout_id = serializers.UUIDField(required=True)

# OUTPUT Serializer
class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductsListSerializer()
    class Meta:
        model = OrderItem
        fields = ['id',"product" ,'variant', 'quantity', 'price', 'status']


class OrderDetailSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'order_status', 'total', 'order_items']


class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, read_only=True)
    total_item = serializers.SerializerMethodField()
    preview_item = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['id', 'user', 'order_status', 'total', 'order_items',"total_item","preview_item"]

    def get_total_item(self,obj):
        return obj.order_items.count()
    
    def get_preview_item(self,obj):
        request = self.context.get('request')
        item = obj.order_items.first()
        if item and item.product.images.exists():
            image = item.product.images.first().image
            return {
                "name":item.product.pro_name,
                "image": request.build_absolute_uri(image.url) if request else image.url
            }
        
        return None
    


# pending payments order serializer
class OrderPendingPaymentSerializer(serializers.ModelSerializer):
    preview_item = serializers.SerializerMethodField()
    order_items = OrderItemSerializer(many=True, read_only=True)
    item_count = serializers.SerializerMethodField()
    class Meta:
        model = Order
        fields = ['id','total','order_status',"preview_item","item_count","order_items"]

    def get_item_count(self,obj):
        return obj.order_items.count()

    def get_preview_item(self,obj):
        request = self.context.get('request')
        item = obj.order_items.first()
        
        if item:
            image_obj = item.product.images.first()
            return {
            "name":item.product.pro_name,
            "image": request.build_absolute_uri(image_obj.image.url) if request else image_obj.image.url
        }
        return None



# ADMIN ENDPOINTS SERIALIZER

class AdminOrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = "__all__"