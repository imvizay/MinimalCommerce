
from .models import Category , Product , ProductImage , ProductVariant
from django.db import transaction

from rest_framework import serializers
from rest_framework.serializers import ModelSerializer


class CategorySerializer(ModelSerializer):
    slug = serializers.ReadOnlyField()
    class Meta:
        model = Category
        fields = ["id","name",'slug']

class ProductImageSerializer(ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['image']

class ProductVariantSerializer(ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ['size','color','stock']


# Amdin Product Serializer For Performing Crud
class ProductSerializer(ModelSerializer):

    # Write only fields 
    uploaded_images = serializers.ListField(child=serializers.ImageField(),write_only=True,required=False)
    variants_data = serializers.JSONField(required=False,write_only=True)

    # read only fields
    images = ProductImageSerializer(many=True,read_only=True)
    variants = ProductVariantSerializer(many=True,read_only=True)

    class Meta:
        model = Product

        fields = [
            # products fields
            'id','category','pro_name','pro_price','pro_description',
            # create only fields 
            'uploaded_images','variants_data',
            # read only fields
            'images','variants'
            ]

    def create(self, validated_data):

        images_data = validated_data.pop('uploaded_images',[])
        variants_data = validated_data.pop('variants_data',[])
    
        product = Product.objects.create(**validated_data)
    
        ProductImage.objects.bulk_create([
            ProductImage( product=product, image=img )
            for img in images_data
        ])
    
        ProductVariant.objects.bulk_create([
            ProductVariant(product=product,**variant)
            for variant in variants_data
        ])
    
        return product
       


class ProductsListSerializer(ModelSerializer):
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = "__all__"