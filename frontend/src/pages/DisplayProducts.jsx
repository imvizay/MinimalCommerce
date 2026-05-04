import "@assets/css/products/product_list.css";
import { useState } from 'react';
import ProductCard from '../components/cards/ProductDisplayCard';
import { useQuery } from '@tanstack/react-query';
import { loadCategories, loadProducts } from '../services/api/products/products';
import { useSearchParams } from 'react-router-dom'

function DisplayProducts() {

  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)

  const activeCat = searchParams.get('category') || 1
  const price = searchParams.get('price') || null 

  const { data: categoryList } = useQuery({
    queryKey: ['category'],
    queryFn: loadCategories
  })

  const filters = {
    category: Number(activeCat),
    price: price ?? null
  }

  const { data: productList } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => loadProducts(filters)
  })

  const handleFilterCategory = (e) => {
    const cat = e.target.dataset.category
    setSearchParams(prev => {
      prev.set("category", cat)
      return prev
    })
  }

  const handlePriceFilter = (e) => {
    let price = e.target.dataset.price
    if (price.includes("₹")) price = price.replace("₹", "")

    setSearchParams(prev => {
      prev.set("price", price)
      return prev
    })
  }

  return (
      <div className="displayLayout">
      
        {/* FILTER SECTION */}
        <aside className="filterSidebar">

          <h2 className="filterTitle">Filters</h2>

          {/* Category */}
          <div className="filterSection">
            <h4 className="sectionTitle">Category</h4>

            <div onClick={handleFilterCategory} className="filterOptions">
              {categoryList?.map((el) => (
                <button
                  key={el.id}
                  data-category={el.id}
                  className={`filterOption ${activeCat == el.id ? "active" : ""}`}
                >
                  {el.name}
                </button>
              ))}
            </div>
          </div>
            
          {/* Price */}
          <div className="filterSection">
            <h4 className="sectionTitle">Price</h4>
            
            <div onClick={handlePriceFilter} className="filterOptions">
              {['low - high', 'high - low','above ₹5000','above ₹10000'].map((el,index)=>(
                <button
                  key={index}
                  data-price={el}
                  className={`filterOption ${price == el ? 'active' : ''}`}
                >
                  {el}
                </button>
              ))}
            </div>
          </div>
            
        </aside>
            
        {/* PRODUCTS */}
        <main className="productArea">
            
          <div className="productHeader">
            <h2>All Products</h2>
            <span className="productCount">{productList?.length || 0}</span>
          </div>
            
          <div className="productGrid">
            {productList?.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
        </main>
          
      </div>
    )
}

export default DisplayProducts