import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { loadAdminProducts } from '@services/api/admin/admin'
import "@assets/css/admindashboard/admin_products.css"

function AdminProducts() {

  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isPending, isError } = useQuery({
    queryKey: ['products', page],
    queryFn: () => loadAdminProducts(page),
    keepPreviousData: true
  })

  if (isPending) return <p>Loading products...</p>
  if (isError) return <p>Something went wrong</p>

  const products = data.results
  const totalPages = Math.ceil(data.count / limit)

  return (
    <div className="admin-products">

      <h2 className="section-title">Products</h2>

      {/* ================= GRID ================= */}
    <div className="products-content">
      <div className="product-grid">

        {products.length === 0 ? (
          <p>No products found</p>
        ) : (
          products.map(product => {
            const image = product.image?.[0]?.image

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
                  <button className="btn view">View</button>
                  <button className="btn edit">Edit</button>
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