from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import CreateOrderInputSerializer,OrderSerializer

# buisness logic
from .services import create_order

# views...

class CreateOrderView(APIView):
    def post(self, request):
        user = request.user
        serializer = CreateOrderInputSerializer( data = request.data )

        if serializer.is_valid():
            items = serializer.validated_data['items']
            order = create_order(user,items)
            return Response(
                OrderSerializer(order).data,
                status = status.HTTP_201_CREATED
                )
        
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
        
