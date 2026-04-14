from django.db import models
from django.utils.text import slugify 

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(unique=True)

    def save(self,*args,**kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    
class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    pro_name = models.CharField(max_length=50)
    pro_price = models.DecimalField(max_digits=8,decimal_places=2,blank=False,null=False)
    pro_description = models.TextField()  

    def __str__(self):
        return self.pro_name

class ProductImage(models.Model):
    product = models.ForeignKey(Product,on_delete=models.CASCADE,related_name="images")
    image = models.ImageField(upload_to='products/')

    def __str__(self):
        return self.product.pro_name

class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE,related_name="variants")
    size = models.CharField(max_length=10,null=True,blank=False)
    color = models.CharField(max_length=20,null=True,blank=False)
    stock = models.PositiveIntegerField(null=False,blank=False,default = 0)

    def __str__(self):
        return f"{self.product.pro_name} - {self.size} - {self.color} " 


