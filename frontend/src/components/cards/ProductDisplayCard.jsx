import React from "react";
import "@assets/css/products/product_display_card.css"


// useCart hook
import { useCart } from "@contexts/CartContext";
import { useUserContext } from "@contexts/UserContext";

// query fn
import { useMutation } from "@tanstack/react-query";

// service api
import { saveCartIntoDb } from "@services/api/users/cart";

function ProductCard({ product }) {
  const { user } = useUserContext()
  const { loadingId, addToCart } = useCart()


  const cartMutation = useMutation({
    mutationKey:['addtocart',user?.id],
    mutationFn: () => saveCartIntoDb(product)
  })

  // HANDLE SAVING CART ITEM INTO SESSION/DATABASE.
  const manageCart = (product) => {
    
    /* client not logged in save into session storage */
    if(!user) return addToCart(product)
  
    /* client logged in save into database storage */
    else{
      
      cartMutation.mutate()
      if(cartMutation.isError){
        console.log('something went wrong')
      }
      console.log('saved cart successfully.')
      return
    }
    // () => addToCart(product)
  }

  return (
    <div className="productCard">

      <div className="productImageWrapper">
        <img src={product?.images[0]?.image || ""} alt={product.pro_name} />

        {product.discount && (
          <span className="discountBadge">
            {product.discount}% OFF
          </span>
        )}
      </div>

      <div className="productInfo">

        <h3 className="productTitle">{product.pro_name}</h3>

        <div className="productPrice">
          <span className="currentPrice">₹{product.pro_price}</span>

          {product.originalPrice && (
            <span className="oldPrice">₹{product.originalPrice}</span>
          )}
        </div>

        <button
          className="addToCartBtn"
          onClick={()=>manageCart(product)}
          disabled={loadingId == product.id}
        >
          {loadingId == product.id ? "Adding..." : "Add to Cart"}
        </button>

      </div>
    </div>
  )
}

export default ProductCard