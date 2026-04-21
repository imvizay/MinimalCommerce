import React from "react";
import "@assets/css/products/product_display_card.css"

function ProductCard({product}) {
    
  return (
    <div className="productCard">

      {/* Image + badge */}
      <div className="productImageWrapper">
        <img src={product?.images[0]?.image|| ""} alt={product.pro_name} />

        {product.discount && (
          <span className="discountBadge">
            {product.discount}% OFF
          </span>
        )}
      </div>

      {/* Info */}
      <div className="productInfo">

        <h3 className="productTitle">{product.pro_name}</h3>

        {/* Price */}
        <div className="productPrice">
          <span className="currentPrice">₹{product.pro_price}</span>

          {product.originalPrice && (
            <span className="oldPrice">₹{product.originalPrice}</span>
          )}
        </div>

        {/* Button */}
        <button className="addToCartBtn">
          Add to Cart
        </button>

      </div>
    </div>
  )
}

export default ProductCard