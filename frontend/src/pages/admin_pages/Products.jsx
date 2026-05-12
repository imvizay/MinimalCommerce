
import "@assets/css/admindashboard/admin_products.css"
import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { loadAdminProducts } from '@services/api/admin/admin'

import { useNavigate } from "react-router-dom"
import { removeProductAPI } from "../../services/api/admin/products"

function AdminProducts() {

  const [page, setPage] = useState(1)
  const limit = 200
  const navigate = useNavigate()

  const { data, isPending, isError } = useQuery({
    queryKey: ['products', page],
    queryFn: () => loadAdminProducts(page),
    keepPreviousData: true
  })

  const removeProductMutation = useMutation({
    mutationFn:(id) => removeProductAPI(id)
  })

  if (isPending) return <p>Loading products...</p>
  if (isError) return <p>Something went wrong</p>


  const products = data.results
  const totalPages = Math.ceil(data.count / limit)

  // handle edit product and navigate to the create-product route 
  const handleEdit = (id) => {
    navigate(`create-products?id=${id}`,)
  }

  const handleRemove = (id) => {
      if(!id) return 
      removeProductMutation.mutate(id)
  }


  return (
    <div className="admin-products">

    {/* ================= HEADER ================= */}

    <div className="products-header">
      
      <div className="header-left">
        <h1>Products Management</h1>
      
        <p>
          Manage your inventory, create products,
          update pricing and monitor store listings.
        </p>
      </div>
      
      <div className="header-actions">
      
        <button 
        onClick={()=>navigate('create-products')}
        className="create-product-btn">
          + Add Product
        </button>
      
      </div>
      
    </div>

    <div className="products-toolbar">

      <input
        type="text"
        placeholder="Search products..."
        className="search-input"
      />

    </div>

    <div className="product-stats">

      <div className="stat-card">
        <h3>{data.count}</h3>
        <p>Total Products</p>
      </div>

      <div className="stat-card">
        <h3>12</h3>
        <p>Categories</p>
      </div>

      <div className="stat-card">
        <h3>4</h3>
        <p>Out Of Stock</p>
      </div>

    </div>

      {/* ================= GRID ================= */}
    <div className="products-content">
      <div className="product-grid">

        {products.length === 0 ? (
          <p>No products found</p>
        ) : (
          products.map(product => {
            const image = product.images?.[0]?.image

            return (
              <div key={product.id} className="product-card">

                {/* Image */}
                <div className="product-image">
                  <img 
                    src={image || "https://via.placeholder.com/200"} 
                    alt={product.pro_name}
                  />
                </div>

                {/* Info */}
                <div className="product-info">
                  <h3>{product.pro_name}</h3>
                  <p className="price">₹ {product.pro_price}</p>
                  <p className="desc">
                    {product.pro_description.slice(0, 60)}...
                  </p>
                </div>

                {/* Actions */}
                <div className="product-actions">
                  <button className="btn edit"
                    onClick={()=>handleEdit(product.id)}
                  >
                    Edit
                  </button>

                  <button className="btn remove"
                    disabled={removeProductMutation.isPending}
                    onClick={()=>handleRemove(product.id)}
                  >
                    Remove
                  </button>
                </div>

              </div>
            )
          })
        )}

      </div>
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="pagination">

        <button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => {
          const pageNumber = i + 1
          return (
            <button
              key={pageNumber}
              className={page === pageNumber ? 'active-page' : ''}
              onClick={() => setPage(pageNumber)}
            >
              {pageNumber}
            </button>
          )
        })}

        <button
          disabled={!data.next}
          onClick={() => setPage(p => p + 1)}
        >
          Next
        </button>

      </div>

    </div>
  )
}

export default AdminProducts