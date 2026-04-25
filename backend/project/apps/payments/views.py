from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings
import razorpay

from .services import verify_and_update_payment


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