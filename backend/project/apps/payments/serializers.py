from rest_framework import serializers
from .models import Payment

from apps.orders.serializers import OrderPendingPaymentSerializer

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            "id",
            "order",
            "amount",
            "currency",
            "status",
            "is_paid",
            "provider",
            "provider_order_id",
            "provider_payment_id",
            "created_at",
        ]
        read_only_fields = fields



# serializer for showing response for pending payment api endpoint for orders
class LoadingPendingOrderPaymentSerializer(serializers.ModelSerializer):
    order = OrderPendingPaymentSerializer(read_only=True)

    class Meta:
        model = Payment
        fields = [
            'order',
            'amount',
            'currency',
            'status',
            'is_paid',
            'created_at'
        ]