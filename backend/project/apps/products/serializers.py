
from .models import Category , Product , ProductImage , ProductVariant
from .validators import validate_product_creation

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

    image = ProductImageSerializer(many=True,write_only=True)
    variants = ProductVariantSerializer(many=True,write_only=True)

    def validate(self, data):
        return super().validate(data)

    class Meta:
        model = Product
        fields = ['category','pro_name','pro_price','pro_description','image','variants']

    def create(self, validated_data):

       images_data = validated_data.pop('images',[])
       variants_data = validated_data.pop('variants',[])

       # Create Product Ins.
       product = Product.objects.create(**validated_data)

       # Create Images Ins.    
       ProductImage.objects.bulk_create(
           [ProductImage.objects.create(product=product,image=img['image']) for img in images_data]
       )
        # Create Variants
       ProductVariant.objects.bulk_create([
            ProductVariant(product = product, **variant)
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