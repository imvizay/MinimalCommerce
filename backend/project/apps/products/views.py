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
from .models import Product,Category,ProductImage



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

        print("REQ REACHED - BULK CREATE VIEW")

        csv_file = request.FILES.get('csv_file')
        zip_file = request.FILES.get('zip_file')

        # VALIDATION
        bulkcreate_product_validation( 
            csv_file, 
            zip_file 
        )

        print('FILES VALIDATION GET SUCCESS')

        temp_dir = tempfile.mkdtemp()

        try:
            
            # =========================
            # SAVE ZIP
            # =========================

            zip_path = os.path.join(
                temp_dir,
                zip_file.name
            )

            with open(zip_path, 'wb+') as destination:

                for chunk in zip_file.chunks():

                    destination.write(chunk)

            print("ZIP SAVED")


            # =========================
            # EXTRACT ZIP
            # =========================

            extract_path = os.path.join(
                temp_dir,
                "extracted_images"
            )

            os.makedirs(
                extract_path,
                exist_ok=True
            )

            with zipfile.ZipFile(zip_path, 'r') as zip_ref:

                zip_ref.extractall(extract_path)

            print("ZIP EXTRACTION SUCCESS")


            # =========================
            # IMAGE LOOKUP
            # =========================

            image_lookup = {}

            for root, dirs, files in os.walk(extract_path):

                for file in files:

                    full_path = os.path.join(
                        root,
                        file
                    )

                    image_lookup[file] = full_path

            print("IMAGE LOOKUP CREATED")


            # =========================
            # CSV PARSE
            # =========================

            decoded_file = (
                csv_file
                .read()
                .decode('utf-8-sig')
                .splitlines()
            )

            reader = csv.DictReader(decoded_file)

            print("CSV PARSED SUCCESSFULLY")


            # =========================
            # RESULT TRACKERS
            # =========================

            created_products = []
            failed_products = []


            # =========================
            # LOOP CSV ROWS
            # =========================

            for row in reader:

                try:

                    print("CURRENT ROW", row)

                    with transaction.atomic():

                        # ====================
                        # CREATE PRODUCT
                        # ====================

                        product = Product.objects.create(
                            category_id=row['category'],
                            pro_name=row['pro_name'],
                            pro_description=row['pro_description'],
                            pro_price=row['pro_price']
                        )

                        print("PRODUCT CREATED")


                        # ====================
                        # HANDLE IMAGES
                        # ====================

                        image_names = ( row['image_names'] .split('|') )

                        for img_name in image_names:

                            img_name = img_name.strip()
                            image_path = image_lookup.get(img_name)

                            if not image_path:
                                print(f"IMAGE NOT FOUND - {img_name}")
                                continue


                            with open(image_path, 'rb') as img:

                                ProductImage.objects.create(
                                    product=product,
                                    image=File(
                                        img,
                                        name=img_name
                                    )
                                )

                        print("IMAGE CREATED")


                        # ====================
                        # TRACK SUCCESS
                        # ====================

                        created_products.append({
                            'product': product.pro_name
                        })


                except Exception as row_error:

                    print("ROW ERROR:", row_error)

                    failed_products.append({
                        "product": row.get('pro_name'),
                        "error": str(row_error)
                    })


            # =========================
            # FINAL RESPONSE
            # =========================

            return Response({

                "message": "Bulk import completed",

                "created_count": len(created_products),

                "failed_count": len(failed_products),

                "created_products": created_products,

                "failed_products": failed_products

            })


        except Exception as error:

            print("BULK IMPORT ERROR:", error)

            return Response({"error": str(error)},status=500)


        finally:

            # =========================
            # CLEAN TEMP FILES
            # =========================
            shutil.rmtree(
                temp_dir,
                ignore_errors=True
            )
            print("TEMP FILES CLEANED")




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

        
        

        


