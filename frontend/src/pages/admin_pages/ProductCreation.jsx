import "@assets/css/admindashboard/product_creation.css"
import { useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { loadCategories } from "@services/api/products/products"
import { createProductAPI } from "@services/api/admin/products"

function ProductCreation() {

  const [activeTab, setActiveTab] = useState("single")

  const [formData, setFormData] = useState({
    category: "",
    pro_name: "",
    pro_price: "",
    pro_description: "",
  })

  const [images, setImages] = useState([])
  const [variants, setVariants] = useState([])
  const [csvFile, setCsvFile] = useState(null)
  const [zipFile,setZipFile] = useState(null)

  const { data: categories } = useQuery({
    queryKey: ["category"],
    queryFn: loadCategories,
    staleTime: 1000 * 60 * 60 * 24
  })

  const mutateProductCreation = useMutation({
    mutationFn: createProductAPI,

    onSuccess: () => {

      alert("Product Created Successfully")

      setFormData({
        category: "",
        pro_name: "",
        pro_price: "",
        pro_description: "",
      })

      setImages([])
      setVariants([])
    },

    onError: (error) => {
      console.log(error)
      alert("Something went wrong")
    }
  })

  const handleChange = (e) => {

    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files))
  }

  const addVariant = () => {

    setVariants(prev => [
      ...prev,
      {
        size: "",
        color: "",
        stock: ""
      }
    ])
  }

  const removeVariant = (index) => {

    setVariants(prev =>
      prev.filter((_, i) => i !== index)
    )
  }

  const handleVariantChange = (index, field, value) => {

    setVariants(prev =>
      prev.map((variant, i) =>
        i === index
          ? { ...variant, [field]: value }
          : variant
      )
    )
  }

  const handleSubmit = (e) => {

    e.preventDefault()

    const data = new FormData()

    data.append("category", formData.category)
    data.append("pro_name", formData.pro_name)
    data.append("pro_price", formData.pro_price)
    data.append("pro_description", formData.pro_description)

    images.forEach(image => {
      data.append("uploaded_images", image)
    })

    data.append(
      "variants_data",
      JSON.stringify(variants)
    )

    mutateProductCreation.mutate(data)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if(!file){
        return
    }
    if(file.name.endsWith('.csv')){
        setCsvFile(file)
    }
    else if(file.name.endsWith('.zip')){
        setZipFile(file)
    }
    else{
        alert("Only CSV and ZIP files allowed")
    }
  }

  return (

    <div className="product-creation-page">

      <div className="creation-header">

        <div>

          <h1>Create Products</h1>
          <p>Add products manually or import inventory using CSV.  </p>

        </div>

      </div>

      <div className="creation-tabs">

        <button  className={activeTab === "single" ? "active-tab" : ""}  onClick={() => setActiveTab("single")}>Single Product</button>

        <button className={activeTab === "bulk" ? "active-tab" : ""} 
        onClick={() => setActiveTab("bulk")}>Bulk CSV Upload</button>

      </div>

      {activeTab === "single" && (

        <form className="creation-card" onSubmit={handleSubmit} >

          <div className="form-section">

            <h2>Basic Information</h2>

            <div className="form-grid">

              <input type="text" name="pro_name" placeholder="Product Name" value={formData.pro_name} onChange={handleChange} />

              <input type="number" name="pro_price" placeholder="Price" value={formData.pro_price} onChange={handleChange} />

              <select name="category" value={formData.category} onChange={handleChange}   >

                <option value=""> Select Category </option>

                {categories?.map(category => (

                  <option key={category.id} value={category.id} > {category.name} </option>

                ))}

              </select>

            </div>

            <textarea name="pro_description" placeholder="Product Description" value={formData.pro_description} onChange={handleChange} />

          </div>

          <div className="form-section">

            <div className="section-heading">

              <h2>Product Images</h2>

              <span> {images.length} Selected   </span>

            </div>

            <label className="custom-upload-box">

              <input type="file" multiple accept="image/*" onChange={handleImageChange}   />

              <div className="upload-content">

                <h3>Upload Images</h3>
                <p> Click or drag product images here </p>

              </div>

            </label>

            {images.length > 0 && (

              <div className="preview-grid">

                {images.map((image, index) => (

                  <div key={index} className="preview-image-card"   >

                    <img src={URL.createObjectURL(image)} alt="preview" />

                    <button type="button" className="remove-image-btn" onClick={() => removeVariant(index)} >   ✕ </button>

                  </div>

                ))}

              </div>

            )}

          </div>

          <div className="form-section">

            <div className="variant-header">
              <h2>Variants</h2>

              <button type="button" className="add-variant-btn" onClick={addVariant} > + Add Variant   </button>

            </div>

            {variants.length === 0 && (

              <p className="empty-variant-text"> No variants added   </p>

            )}

            {variants.map((variant, index) => (

              <div className="variant-row" key={index} >

                <input type="text" placeholder="Size" value={variant.size}
                  onChange={(e) =>
                    handleVariantChange(
                      index,
                      "size",
                      e.target.value
                    )
                  }
                />

                <input type="text" placeholder="Color" value={variant.color}
                  onChange={(e) =>
                    handleVariantChange(
                      index,
                      "color",
                      e.target.value
                    )
                  }
                />

                <input type="number" placeholder="Stock" value={variant.stock}
                  onChange={(e) =>
                    handleVariantChange(
                      index,
                      "stock",
                      e.target.value
                    )
                  }
                />

                <button type="button" className="remove-variant-btn"
                  onClick={() => removeVariant(index)}> Remove </button>

              </div>

            ))}

          </div>

          <div className="submit-area">
            <button type="submit" className="publish-btn" >
              { mutateProductCreation.isPending ? "Creating..." : "Create Product"}
            </button>
          </div>

        </form>

      )}

      {/* CSV INPUT FILE */}
      {activeTab === "bulk" && (

        <div className="creation-card bulk-card">
        
          {/* ================= HEADER ================= */}

          <div className="bulk-header">

            <div>

              <h2>Bulk Product Import</h2>

              <p>
                Upload a CSV file to create multiple
                products, variants and inventory records
                instantly.
              </p>

            </div>

            <div className="bulk-badge">
              CSV ONLY
            </div>

          </div>

          {/* ================= STEPS ================= */}

          <div className="bulk-steps">

            <div className="step-item active-step">

              <span>1</span>

              <p>Download Template</p>

            </div>

            <div className="step-line"></div>

            <div className="step-item">

              <span>2</span>

              <p>Upload CSV</p>

            </div>

            <div className="step-line"></div>

            <div className="step-item">

              <span>3</span>

              <p>Import Products</p>

            </div>

          </div>

          {/* ================= TEMPLATE SECTION ================= */}

          <div className="bulk-template-section">
            <div className="template-info">
              <h3>CSV Template</h3>
              <p>
                Use our pre-defined template structure
                for faster and error-free imports.
              </p>
            </div>
            <button className="download-template-btn"> Download Template   </button>
          </div>

          {/* ================= UPLOAD AREA ================= */}

          <label className="csv-upload-area">
            <input type="file" accept=".csv,.zip" onChange={handleFileChange}   />

            <div className="upload-inner-content">

              <div className="upload-icon"> ↑ </div>
              <h3>Upload CSV File</h3>
              <p>Drag and drop your CSV here or tap to browse</p>

            </div>

          </label>

          {/* ================= FILE PREVIEW ================= */}
          {csvFile &&  (

                <div className="uploaded-file-card">
                
                  <div className="file-left">
                    <div className="file-icon">CSV</div>
                    <div className="file-details">
                      <h4>{csvFile.name}</h4>
                      <p> Ready for import </p>
                    </div>
                  </div>
                  <button className="remove-file-btn" onClick={() => setCsvFile(null)} >Remove</button>

                </div>
              )}

          {zipFile &&  (

                <div className="uploaded-file-card">
                
                  <div className="file-left">
                    <div className="file-icon">ZIP</div>
                    <div className="file-details">
                      <h4>{zipFile.name}</h4>
                      <p> Ready for import </p>
                    </div>
                  </div>
                  <button className="remove-file-btn" onClick={() => setZipFile(null)} >Remove</button>

                </div>
              )}



              {/* ================= CSV GUIDE ================= */}
              <div className="csv-guide-box">
                <h4>Required CSV Columns</h4>
                <div className="csv-columns">
                  <span>category</span>
                  <span>pro_name</span>
                  <span>pro_price</span>
                  <span>pro_description</span>
                  <span>size</span>
                  <span>color</span>
                  <span>stock</span>
                </div>
              </div>
          

              <div className="bulk-submit-area">
                <button className="publish-btn bulk-import-btn"
                // onClick={}
                disabled={!csvFile} > Import Products   </button>
              </div>
            </div>
          )}

          </div>
        )
}

export default ProductCreation