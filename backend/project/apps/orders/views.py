from django.db import transaction
from rest_framework import status
# Razorpay 
import razorpay
from django.conf import settings
from django.db.models import Prefetch
# Rest Framework views and serializers
from rest_framework.generics import ListAPIView 
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import CreateCartOrderInputSerializer , OrderSerializer

# admin serializer
from .serializers import AdminOrderSerializer

# models 
from apps.orders.models import Order ,OrderItem

# Services
from .services import create_order 

from django.shortcuts import render



# ....... VIEWS.......

class CreateCartOrderView(APIView):
    "Order creation for user cart items."
    def post(self,request):
        print(f"VIEWS : {request.data}")
        user = request.user
        if not user:
            return Response({'message':'invalid user'},status=400)
        
        serializer = CreateCartOrderInputSerializer(data=request.data)    
        if not serializer.is_valid():
            return Response(serializer.errors,status=400)
    
        validated_data = serializer.validated_data
        order = create_order(user,validated_data) # Create Razorpay Order

        return Response(order,status=201) 
        


# =========================
#  Userdashboard endpoints 
# =========================

class GetUserProducts(APIView):

    def get(self,request):
        user = request.user
        qs = Order.objects.filter(user=user)

        query = request.query_params.get("status")

        if query != "all":
            qs = qs.filter(order_status=query)
        
        qs = qs.prefetch_related(
                Prefetch(
                        'order_items',
                         queryset = OrderItem.objects.select_related('product','variant').prefetch_related(
                                                                                "product__images",)
                        )
                )
        
        serializer = OrderSerializer(qs,many=True,context={"request":request})

        print("SERIALIZER DATA:",serializer.data)

        return Response(serializer.data,status=200)
        


# ===========
# ADMIN VIEWS
# ===========
from .pagination import AdminRecentOrderPagination
class OrdersList(ListAPIView):
        """
        shows recent orders at admin home page
        """
        queryset  = Order.objects.all().order_by('-created_at')
        serializer_class = AdminOrderSerializer 
        pagination_class = AdminRecentOrderPagination


class FinalizeOrder(APIView):
    """
    Updates order item statuses only (no stock logic yet)
    """
    def post(self, request):
        order = request.data.get('order_id')
        print("REQ DATA: ",request.data)
        try:
            with transaction.atomic():
                
                # lock order
                order = Order.objects.select_for_update().get(id=order)

                # prevent double finalize
                if getattr(order, "is_finalized", False):
                    return Response(
                        {"message": "Order already finalized"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                items_data = request.data.get("items", [])

                if not items_data:
                    return Response(
                        {"message": "No items provided"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                refund_amount = 0

                # update items
                for item_data in items_data:
                    item = OrderItem.objects.select_for_update().get(id=item_data["id"], order=order)
                    new_status = item_data["status"]

                    if new_status not in ["confirmed", "cancelled"]:
                        return Response(
                            {"message": "Invalid status"},
                            status=status.HTTP_400_BAD_REQUEST
                        )

                    item.status = new_status

                    # refund calculation
                    if new_status == "cancelled":
                        refund_amount += item.quantity * item.price

                    # Deduct stock 
                    # if new_status == "confirmed":
                    #     deduct stock here

                    item.save()

                # determine order status
                total_items = order.order_items.count()
                confirmed_count = order.order_items.filter(status="confirmed").count()
                cancelled_count = order.order_items.filter(status="cancelled").count()

                if cancelled_count == total_items:
                    order.order_status = "cancelled"
                elif confirmed_count == total_items:
                    order.order_status = "confirmed"
                else:
                    order.order_status = "partially_confirmed"

                order.is_finalized = True
                order.save()

                # notification logic here

                return Response({
                    "message": "Order finalized successfully",
                    "refund_amount": refund_amount,
                    "order_status": order.order_status
                }, status=status.HTTP_200_OK)

        except Order.DoesNotExist:
            return Response(
                {"message": "Order not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        except OrderItem.DoesNotExist:
            return Response(
                {"message": "Invalid order item"},
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )