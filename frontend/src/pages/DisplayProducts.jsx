import React,{ useState } from 'react';
import "@assets/css/products/product_list.css";

import ProductCard from '../components/cards/ProductDisplayCard';
// tanstack
import { useQuery } from '@tanstack/react-query';
// Query Fn
import { loadProducts } from '../services/api/products/products';

function DisplayProducts() {

    const [activeCat,setActiveCat] = useState(5)
    const [priceFilterCat,setPriceFilter] = useState(null)

    // QUERY PARAMS

    const filters = {
      category:activeCat,
      price:priceFilterCat ?? null
    }

    // LOAD PRODUCTS 
    const {data:products, isLoading,isError,err } = useQuery({
        queryKey:['products',filters],
        queryFn: () => loadProducts(filters),
    })

    // PRODUCTS CATEGORY 
    const handleFilterCategory = (e) => {
        console.log(e.target.dataset.category)
        setActiveCat(e.target.dataset.category)
    }

    // PRICE FILTER OF CATEGORY 
    const handlePriceFilter = (e) => {
        console.log(e.target.dataset.price)
        setPriceFilter(e.target.dataset.price)
    }

  


  return (
    <div className="displayLayout">

      {/* LEFT FILTER SIDEBAR */}
      <aside className="filterSidebar">

        <h2 className="filterTitle">Filters</h2>

        {/* Category */}
        <div className="filterSection">
          <h4 className="sectionTitle">Category</h4>
            
        {/* Filter Options  */}
          <div onClick={ (e) => handleFilterCategory(e) } className="filterOptions">

            {["mens","womens",'jeans','jackets','trousers','shoes'].map((el,index)=>(
                <button key={el || index} 
                    data-category={el} 
                    className={`filterOption ${activeCat == el ? "active":''}`}
                >
                        {el.toUpperCase()} 
                </button>
            ))}

          </div>
        </div>

        {/* Price */}
        <div className="filterSection">
          <h4 className="sectionTitle">Price</h4>
            {/* Price filter Options */}
          <div onClick={ (e) => handlePriceFilter(e) } className="filterOptions">
            {['low - high', 'high - low','above ₹5000','above ₹10000'].map((el,index)=>(
                <button key={el || index} 
                data-price={el}
                className={`filterOption ${priceFilterCat == el ? 'active' : ''}`}
                >
                    {el.toLocaleUpperCase()}
                </button>
            ))}
        </div>
        </div>

      </aside>

      {/* RIGHT PRODUCT AREA */}
      <main className="productArea">

        {/* Top bar */}
        <div className="productHeader">
          <h2>All Products</h2>
          <span className="productCount">{products?.length || 0}</span>
        </div>

    
        <div className="productGrid">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </main>

    </div>
  )
}

export default DisplayProducts