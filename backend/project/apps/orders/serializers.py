
from .models import Order,OrderItem

from rest_framework import serializers

from .validators import order_validation

# INPUT Serializer

class OrderItemInputSerializer(serializers.Serializer):
    variant_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class CreateOrderInputSerializer(serializers.Serializer):
    items = OrderItemInputSerializer(many=True)

    def validate(self, data):
        return order_validation(data)




# OUTPUT Serializer
class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'variant', 'quantity', 'price', 'status']

class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, read_only=True)
    class Meta:
        model = Order
        fields = ['id', 'user', 'order_status', 'total', 'order_items']