import React from 'react';
import ProductCard from '../components/cards/ProductDisplayCard';
import "@assets/css/products/product_list.css";

// tanstack
import { useQuery } from '@tanstack/react-query';

// Query Fn
import { loadProducts } from '../services/api/products/products';

function DisplayProducts() {

    // Get Products From Database Default Shoes/Mens
    const {data:products, isLoading,isError,err } = useQuery({
        queryKey:['products'],
        queryFn:loadProducts,
        
    })


  return (
    <div className="displayLayout">

      {/* LEFT FILTER SIDEBAR */}
      <aside className="filterSidebar">

        <h2 className="filterTitle">Filters</h2>

        {/* Category */}
        <div className="filterSection">
          <h4 className="sectionTitle">Category</h4>

          <div className="filterOptions">
            <button className="filterOption active">Shoes</button>
            <button className="filterOption">Jackets</button>
            <button className="filterOption">Jeans</button>
            <button className="filterOption">Mens</button>
            <button className="filterOption">Womens</button>
          </div>
        </div>

        {/* Price */}
        <div className="filterSection">
          <h4 className="sectionTitle">Price</h4>

          <div className="filterOptions">
            <button className="filterOption">Low → High</button>
            <button className="filterOption">High → Low</button>
            <button className="filterOption">Above ₹5000</button>
            <button className="filterOption">Above ₹10000</button>
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

        {/* Grid */}
        {/* <div className="productGrid">
          {Array.from({ length: 12 }).map((_, i) => (
            <ProductCard key={i} />
          ))}
        </div> */}

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