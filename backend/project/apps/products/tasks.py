from celery import shared_task
from .models import ImportJob
import tempfile
import os
import csv
import zipfile
from itertools import islice
import shutil

# db
from django.db import transaction

# models
from .models import Product , ProductImage



# Generate Batches for celery task.
def batch_generator(reader,batch_size=200):
    """
    returns batch for celery to perform.
    """
    while True:
        batch = list(islice(reader,batch_size))
        
        if not batch:
            break

        yield batch



@shared_task
def process_bulk_import(job_id):
    print("--- BULK IMPORT TASK STARTED ---")

    job = ImportJob.objects.get(id=job_id)

    try:
        job.status = "processing"
        job.save()

        csvfile = job.csv_file
        zip_file_obj = job.zip_file

        # temp dir to store zip 
        temp_dir = tempfile.mkdtemp()


        # ++++++++++++++ SAVE ZIP ++++++++++++++

        zip_file_path = os.path.join(temp_dir,zip_file_obj.name) # tempoary zip path

        with open(zip_file_path,'wb+') as destination:

            for chunk in zip_file_obj.chunks():
                destination.write(chunk)
        
        print('Zip File Save Done.')


        # -------------- Extract Zip File -------------

        extract_path = os.path.join(temp_dir,"extracted_images")

        os.makedirs(extract_path,exist_ok=True)

        # extraction process start
        with zipfile.ZipFile(zip_file_path,'r') as zip_ref:
            zip_ref.extractall(extract_path)
        
        print("zip extraction done.")


        #  ++++++++++++++++ Image Lookup Dictionary +++++++++++++++

        """
        this part contain creation of image dictornary for 'FAST LOOK-UP'
        for images when parsing csv and matching images with csv image field.
        Without this for every csv row image field the loop runs for every n number of images in temp/zipfile_path to get a equal match
        """

        image_lookup = {}

        for root, dirs , files in  os.walk(extract_path):

            for file in files:

                full_path = os.path.join(root,file)

                relative_path = os.path.relpath(full_path,extract_path)

                relative_path = relative_path.replace('\\','/')

                part_paths = relative_path.split('/')
                
                normalized_path = '/'.join(part_paths[-2:])

                print("normalized path")

                image_lookup[normalized_path] = full_path
           
        print('Image look-up created.')


        # ++++++++++++++++++ CSV PARSEING +++++++++++++++++++

        decode_csvfile = (
            csvfile
            .read()
            .decode('utf-8-sig').
            splitlines()
        )

        reader = csv.DictReader(decode_csvfile)

        # Batch
        batch_size = 200

        print("BATCHs CREATED")
        for batch in batch_generator(reader,batch_size):
            
            batch_task.delay(job_id,batch,image_lookup)

            print("BATCH END")

        job.status="completed"
        job.save()
    
        # CLEAN TEMP FILES   
        shutil.rmtree(
            temp_dir,
            ignore_errors=True
        )
        print("TEMP FILES CLEANED")

    
    # When Failed
    except Exception as e:
        job.status = 'failed'
        job.error_message = str(e)
        job.save()
        raise e



import cloudinary.uploader

# child batch that will do db writes.
@shared_task
def batch_task(job_id,batch,image_lookup):
    print("-- INSIDE BATCH -- ")
    created_products = []
    failed_products = []
    uploaded_cloudinary_ids = []
    
    try:
        # +++ Product Creation +++
        products_objects = []

        # create product list for bulk_create query
        for row in batch:
             products_objects.append(
                 Product(
                     category_id = row['category'],
                     pro_name = row['pro_name'],
                     pro_price = row['pro_price'],
                     pro_description = row['pro_description'],
                 )
             )

        # BULK CREATE PRODUCTS
         
        with transaction.atomic():
            created_products = Product.objects.bulk_create(
                 products_objects,
                 batch_size=200
            )

        print("Bulk Product Create Success.")

        # +++ Handle Images ++++

        image_objects = []

        # keep row mapped with products created
        for product, row in zip(created_products, batch):

            image_names = (row['image_names'].split('|'))

            for img_name in image_names:

                img_name = img_name.strip()

                img_path = image_lookup.get(img_name)
    
                if img_path is None:
                    print("CSV Image",image_names)
                    print(f"IMAGE NOT FOUND: {img_name}")

                    failed_products.append({
                        "product": row['pro_name'],
                        "error": f"Image not found - {img_name}"
                    })

                    continue


                # image exits in csv field uploads it to cloudinary
                with open(img_path,'rb') as img:

                    uploaded_result = cloudinary.uploader.upload(
                        img,
                        folder='products/imports'
                    )

                print("AFTER CLOUDINARY UPLOADS")
                
                # ---- Extract Cloudinary Data ----
                # image_url = uploaded_result['secure_url']
                public_id = uploaded_result['public_id']

                # Track Uploaded Images
                uploaded_cloudinary_ids.append(public_id)

                # Prepare Product Image
                image_objects.append(
                    ProductImage(
                        product=product,
                        image=public_id,
                        public_id=public_id
                    )
                )


        print("TOTAL IMAGE OBJECTS:", len(image_objects))
        for obj in image_objects[:5]:
            print(obj.product_id)
            print(obj.image)
            print(obj.public_id)

        # BULK CREATE IMAGES
        ProductImage.objects.bulk_create(
            image_objects,
            batch_size=500
        )

        print("DB COUNT:",ProductImage.objects.count())

        print("Bulk Images Created")

        return {
        "status": "success",
        "created_products": len(created_products),
        "created_images": len(image_objects),
        "failed_products": failed_products
        }
    

    # HANDLE FAILURE  

    except Exception as e:

        print("BATCH TASK FAILED:", e)
        # MANUAL CLOUDINARY ROLLBACK

        for public_id in uploaded_cloudinary_ids:
            try:
                cloudinary.uploader.destroy(public_id)

                print(f"ROLLBACK DELETE SUCCESS: {public_id}")

            except Exception as cleanup_error:
                print("ROLLBACK DELETE FAILED:",cleanup_error)

        failed_products.append({"error": str(e)})

        return {
            "status": "failed",
            "created_products": 0,
            "failed_products": failed_products
        }


 
    



        

        

        




