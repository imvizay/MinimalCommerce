import "@assets/css/products/product_list.css";
import { useEffect, useState } from 'react';
import ProductCard from '@components/cards/ProductDisplayCard';
import { useQuery } from '@tanstack/react-query';
import { loadCategories, loadProducts } from '@services/api/products/products';
import { useSearchParams } from 'react-router-dom'

// category icon handler
import { getCategoryData } from "@utils/categoryfilters";
import { ShoppingBag } from "lucide-react";

function DisplayProducts() {

  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)

  const activeCat = searchParams.get('category') || 1
  const price = searchParams.get('price') || null 

  const { data: categoryList } = useQuery({
    queryKey: ['category'],
    queryFn: loadCategories,
    staleTime: 1000 * 60 * 60 * 24// 1 day cache
  })

  const filters = {
    category: Number(activeCat),
    price: price ?? null
  }

  const { data: productsList,isLoading:productsLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => loadProducts(filters)
  })


  const handleFilterCategory = (id) => {
    setSearchParams(prev => {
      prev.set("category", id)
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

        <div className="heroSection">
          <img src="/minimalcommerce_icon2.jpg" alt="" />

          <div className="heroSectionMetaData">

            <div className="heroSectionSlogan">
                <span className="look-better">Look Better.</span>
                <span className="live">
                  Live <span className="better">Better.</span>
                </span>
            </div>
          </div>
        </div>
      
        {/* FILTER SECTION */}
        <aside className="filters">
      
          {/* Category */}
          <div className="filter">
            {/* <h4>Categories:-</h4> */}
            <div  className="fil-options">
              {categoryList?.map((el) =>{
                const categoryData = getCategoryData(el.slug)
                return (
               <div 
                key={el.id}
                onClick={()=>handleFilterCategory(el.id)}
                className="fil-box" 
              >
                  <div className="fil-icon">
                    <span className={`${activeCat == el.id ? "fil-active" : ""}`}>{<categoryData.icon/>}</span>
                  </div>
                 <button>
                  {el.slug}
                </button>
               </div>
              )
            })}
            </div>
          </div>
            
          {/* Price */}
          <div className="filters">
          
            <div className="filter" onClick={handlePriceFilter} >
              {/* <h4>Price:-</h4> */}
              <div className="fil-options">
              {['low - high', 'high - low','above ₹5000','above ₹10000'].map((el,index)=>(
                <button
                  key={index}
                  data-price={el}
                  className={`fil-price-btn ${price == el ? 'fil-active' : ''}`}
                >
                  {el}
                </button>
              ))}
              </div>
            </div>
          </div>
            
        </aside>
            
        {/* PRODUCTS */}
        <section id="products" className="products">
      
          <div className="p-header">
            <h2>All Products </h2>
            <span className="p-count">{productsList?.length || 0}</span>
          </div>
          

          {/* PRODUCTS LIST SECTION */}
          <div
            className={`products-list ${
              !productsLoading && productsList?.length === 0  ? "emptyStateActive"  : ""}`}
          >
        
           {productsLoading ? (
            
              <ProductsLoader />
            
            ) : productsList?.length > 0 ? (
            
              productsList.map(product => (
              
                <ProductCard key={product.id} product={product} />
              
              ))
            
            ) : (
            
              <div className="emptyState">
              
                <span> <ShoppingBag /> </span>
            
                <h3>No Products Found</h3>
            
                <p> Try changing filters or explore another category. </p>
            
              </div>

            )}

          </div>
          
          
          
        </section>
      </div>
    )
}

export default DisplayProducts



const ProductsLoader = () => {

  
  return (

    <div className="simple-loader-wrapper">

      <div className="loader-spinner"></div>

      <h3>Loading Products...</h3>

      <p>Please wait while we fetch products</p>

    </div>

  )

} 