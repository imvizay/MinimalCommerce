import "@assets/css/products/product_list.css";
import { useState } from 'react';

import ProductCard from '../components/cards/ProductDisplayCard';
// tanstack
import { useQuery } from '@tanstack/react-query';
// Query Fn
import { loadCategories, loadProducts } from '../services/api/products/products';

import { useSearchParams } from 'react-router-dom'

function DisplayProducts() {

    // const [activeCat,setActiveCat] = useState(5)
    // const [priceFilterCat,setPriceFilter] = useState(null)

    const [searchParams,setSearchParams] = useSearchParams()

    const activeCat = searchParams.get('category') || 5
    const price = searchParams.get('price') || null 
    const order = searchParams.get('order') || '-id'


    // GET CATEGORY
    const {
      data:categoryList,
      isLoading:categoryLoading,
      isError:categoryError
    } = useQuery({
      queryKey:['category'],
      queryFn:loadCategories,
      keepPreviousData: true,  
      staleTime:1000*30*30,
      refetchOnMount:false,
      cacheTime:1000*60*60
    })


    // QUERY PARAMS
    const filters = {
      category:activeCat,
      price:price ?? null
    }

    // GET PRODUCTS 
    const {
      data:productList, 
      isLoading:productLoading,
      isError:productError 
    } = 
      useQuery({
        queryKey:['products',filters],
        queryFn: () => loadProducts(filters),
        keepPreviousData: true,  
        staleTime:1000*30*30,
        refetchOnMount:false,
        cacheTime:1000*60*60
    })

    // Category
    const handleFilterCategory = (e) => {
      const cat = e.target.dataset.category

      setSearchParams(prev => {
        prev.set("category", cat)
        return prev
      })
    }

    // Price
    const handlePriceFilter = (e) => {
      let price = e.target.dataset.price

      if(price.includes("₹")){
        const spilitedPrice = price.split('₹')
        console.log("spilitedPrice",spilitedPrice)
        price = spilitedPrice.join('')
        console.log('combined spilited price',price)
      }

      setSearchParams(prev => {
        prev.set("price", price)
        return prev
      })
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

            {categoryList && categoryList?.map((el)=>(
                <button key={el.id } 
                    data-category={el.id} 
                    className={`filterOption ${activeCat == el.id ? "active":''}`}
                >
                        {el.name.charAt(0).toUpperCase()+ el.name.slice(1).toLowerCase()} 
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
                className={`filterOption ${price == el ? 'active' : ''}`}
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
          <span className="productCount">{productList?.length || 0}</span>
        </div>

    
        <div className="productGrid">
          {productList?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </main>

    </div>
  )
}

export default DisplayProducts