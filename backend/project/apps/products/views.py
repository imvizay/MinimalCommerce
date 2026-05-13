import json
import os
import tempfile
import zipfile
import csv
import shutil

from django.db import transaction
from django.core.files import File


from copy import deepcopy
from .validators import bulkcreate_product_validation

from rest_framework.decorators import action
from rest_framework.viewsets import ModelViewSet,ReadOnlyModelViewSet
from rest_framework.response import Response

from .paginations import ProductsPagination


# products apps serializers models
from .serializers import (
                    ProductSerializer ,
                    CategorySerializer , 
                    ProductsListSerializer )
# products apps models
from .models import Product,Category,ProductImage , ImportJob


# Tasks
from .tasks import process_bulk_import


# Views...

class CategoryView(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

# Crud view for amdin to manage products 
class ProductView(ModelViewSet):
    queryset = Product.objects.all().order_by('-id')
    serializer_class = ProductSerializer
    pagination_class = ProductsPagination
    # permission_classes = [IsAdminOnly] 

    @action(detail=False, methods=['post'])
    def createproduct(self, request):
        data = request.data.copy()

        # real UploadedFile objects
        data.setlist(
            'images',
            request.FILES.getlist('images')
        )

        serializer = self.get_serializer(
            data=data
        )

        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response({
            'message': 'Product Created Successfully'
        })

    @action(detail=False, methods=['post'])
    def bulkcreate(self, request):

        print("--- BULK CREATE VIEW ---")

        csv_file = request.FILES.get('csv_file')
        zip_file = request.FILES.get('zip_file')

        # VALIDATION
        bulkcreate_product_validation( 
            csv_file, 
            zip_file 
        )
        print('-- Import Validation Succedded')

        existing_job = ImportJob.objects.filter(
            status__in = ['queued','processing']
        ).exists()
        
        if existing_job:
            return Response({ "error":"Another import already running" }, status=400)
        
        job = ImportJob.objects.create(
                csv_file=csv_file,
                zip_file=zip_file,
                status="queued"
        )

        process_bulk_import.delay(job.id)

        return Response({ 
            "message":"Import queued successfully", 
            "job_id": job.id 
            })

    


# Read only products for users.
class ListProducts(ReadOnlyModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductsListSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        # query filters
        category = self.request.query_params.get('category')
        price = self.request.query_params.get('min_price')
        order = self.request.query_params.get('order')

        # category filter
        if category:
            qs = qs.filter(category__id=category)

        # min price filter
        if price:
            qs = qs.filter(pro_price__gte=price)

        # return sorted products when sorting is asked by client.
        allowed_order = ['pro_price','-pro_price']
        if order:
            if order in allowed_order:
                qs = qs.order_by(order)
                return qs

        # latest product first
        else:
            return qs.order_by('-id')

        






