from django.db import models
from cloudinary.models import CloudinaryField
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
    image = CloudinaryField('image')
    public_id = models.CharField(max_length=500,blank=True,null=False)

    def __str__(self):
        return self.product.pro_name

class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE,related_name="variants")
    size = models.CharField(max_length=10,null=True,blank=False)
    color = models.CharField(max_length=20,null=True,blank=False)
    stock = models.PositiveIntegerField(null=False,blank=False,default = 0)

    def __str__(self):
        return f"{self.product.pro_name} - {self.size} - {self.color} " 




# BULK IMPORT 

from django.core.files.storage import FileSystemStorage
local_csv_storage = FileSystemStorage(location='imports/csv')
local_zip_storage = FileSystemStorage(location='imports/zip')


class ImportJob(models.Model):

    STATUS_CHOICES = [
        ("queued","Queued"),
        ("processing","Processing"),
        ("completed","Completed"),
        ("failed","Failed"),
        ("cancelled","Cancelled"),
    ]

    status = models.CharField(max_length=20)

    csv_file = models.FileField(storage=local_csv_storage)
    zip_file = models.FileField(storage=local_zip_storage)

    total_rows = models.IntegerField(default=0)

    processed_rows = models.IntegerField(default=0)

    failed_rows = models.IntegerField(default=0)

    progress = models.IntegerField(default=0)

    created_products = models.IntegerField(default=0)

    duplicate_products = models.IntegerField(default=0)

    error_message = models.TextField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    completed_at = models.DateTimeField(null=True, blank=True)


# Track row level failures
class ImportLog(models.Model):

    job = models.ForeignKey(ImportJob,on_delete=models.CASCADE)

    row_number = models.IntegerField()
    product_name = models.CharField(max_length=255)
    status = models.CharField(max_length=20)
    message = models.TextField()


# Track which job created product during impport and remove only those products when admin shutdown import 
class ImportedProductTracker(models.Model):

    job = models.ForeignKey(ImportJob, on_delete = models.CASCADE)
    product = models.ForeignKey(Product, on_delete = models.CASCADE)
