import React from "react";
import "@assets/css/products/product_display_card.css"
const product = {
  id: 1,
  name: "Nike Air Running Shoes",
  image: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQ2Why84pPVeImXKBCn88ksYLNjZXnTH3DVQ1yQ8hb8VY6fHzYJFLtt3RpmBuH-G9_TigBjatwCSq3R9LxqO5lsXlb2RRSCzB-JuAgj10S1SJxqoxsxmae2tCwetMJa3ojwEyfJXEKTtA&usqp=CAc",
  price: 1499,
  originalPrice: 2999,
  

  reviews: 120
}

function ProductCard() {
  return (
    <div className="productCard">

      {/* Image + badge */}
      <div className="productImageWrapper">
        <img src={product.image || ""} alt={product.name} />

        {product.discount && (
          <span className="discountBadge">
            {product.discount}% OFF
          </span>
        )}
      </div>

      {/* Info */}
      <div className="productInfo">

        <h3 className="productTitle">{product.name}</h3>

        {/* Price */}
        <div className="productPrice">
          <span className="currentPrice">₹{product.price}</span>

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