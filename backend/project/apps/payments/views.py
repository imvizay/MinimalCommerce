from rest_framework.response import Response
from rest_framework.views import APIView 
from rest_framework.generics import ListAPIView
from django.conf import settings
import razorpay

from .serializers import LoadingPendingOrderPaymentSerializer , PaymentSerializer

from .services import verify_and_update_payment

from apps.cart.models import Cart
from .models import Payment ,PaymentStatus

class VerifyCartPayment(APIView):
    def post(self, request):

        client = razorpay.Client(
            auth=(settings.RAZORPAY_PUBLIC_KEY, settings.RAZORPAY_SECRET_KEY)
        )

        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_signature = request.data.get('razorpay_signature')

        try:
            # Verify signature
            client.utility.verify_payment_signature({
                "razorpay_order_id": razorpay_order_id,
                "razorpay_payment_id": razorpay_payment_id,
                "razorpay_signature": razorpay_signature,
            })

            result = verify_and_update_payment(
                razorpay_order_id,
                razorpay_payment_id
            )

            cart = Cart.objects.get(user=request.user)
            deleted_count, _ = cart.user_cart.all().delete()
            print(f"Deleted {deleted_count} cart items")

            return Response(result, status=200)

        except razorpay.errors.SignatureVerificationError:
            return Response({
                "message": "Invalid signature",
                "status": "failed"
            }, status=400)

        except Exception as e:
            return Response({
                "message": str(e),
                "status": "error"
            }, status=500)
        



class LoadingPendingOrderPayments(APIView):

    """
    fetch all orders of the current user whose payment status is still pending.
    """
    def get(self,request):
        qs = Payment.objects.filter(user=request.user,status=PaymentStatus.PENDING).select_related("order")
        print("PENDING",qs)

        serializer = LoadingPendingOrderPaymentSerializer(qs,many=True, context={'request': request})

        return Response(serializer.data,status=200)


# admin
from .paginations import PaymentsPagination

class ViewAllPayments(ListAPIView):
    queryset = Payment.objects.all().order_by('-id')
    serializer_class = PaymentSerializer 
    pagination_class = PaymentsPagination
    

    

        
