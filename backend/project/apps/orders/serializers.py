
from .models import Order,OrderItem

from rest_framework import serializers
from apps.products.serializers import ProductsListSerializer
from .validators import order_validation

# INPUT Serializer

class OrderItemInputSerializer(serializers.Serializer):
    variant_id = serializers.IntegerField(required=False)
    quantity = serializers.IntegerField(min_value=1,max_value=10)
    id = serializers.IntegerField()


class CreateCartOrderInputSerializer(serializers.Serializer):
    items = OrderItemInputSerializer(many=True)
    checkout_id = serializers.UUIDField(required=True)

    def validate(self, data):
        print(f"SERIALIZER : {data}")
        order_validation(data)
        return data


# OUTPUT Serializer
class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductsListSerializer()
    class Meta:
        model = OrderItem
        fields = ['id',"product" ,'variant', 'quantity', 'price', 'status']

class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, read_only=True)
    class Meta:
        model = Order
        fields = ['id', 'user', 'order_status', 'total', 'order_items']