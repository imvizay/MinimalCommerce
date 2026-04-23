import React,{useState} from "react";
import "@/assets/css/cart/cart.css"; 

import { useCart } from "../contexts/CartContext";
import { useUserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import LoginPromptModal from "../components/LoginPrompt";

function Cart () {

  const [showLoginPrompt,setShowLoginPrompt] = useState(false)

  const { user } = useUserContext()
  const navigate = useNavigate()

  const { 
    cart,
    updateQty, 
    removeFromCart } = useCart()
 
  const total = cart.reduce((acc, item) => acc + item.pro_price * item.quantity, 0);

  console.log("CART",cart)
  if (cart.length === 0) {
    return (
      <div className="cartEmpty">
        <h2>Your cart is empty</h2>
        <p>Add items to get started</p>

        <button className="emptyCartRedir">click here to <span onClick={()=> window.location.href="/" }>get started</span></button>
      </div>
    )
  }
 
    // Checkout 
    const handleCheckout = () => {
        // user needs to be authenticated before proceeding further(checkout) for cart items
        if(!user){
           setShowLoginPrompt(true)
        }


    }   


    const informLoginPrompt = () => {
        <>
        <div className="informContainer">

        </div>
        </>
    }

  return (
    <div className="cartWrapper">

    {/* If User Not Logged in overlay this  */}
       {showLoginPrompt &&  <LoginPromptModal onClose={setShowLoginPrompt}/>}


      {/* LEFT - ITEMS */}
      <div className="cartItems">
        {cart.map(item => (
          <div key={item.id} className="cartCard">

            <img src={item.images[0].image} alt={item.pro_name} />

            <div className="cartDetails">
              <h3>{item.pro_name}</h3>
              <p className="price">₹{item.pro_price}</p>

              <div className="cartActions">

                {/* Quantity */}
                <div className="qtyControl">
                  <button disabled={item.quantity <= 1} onClick={() => updateQty(item.id, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button disabled={item.quantity >= 10} onClick={() => updateQty(item.id,1)}>+</button>
                </div>

                {/* Remove */}
                <button
                  className="removeBtn"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="itemTotal">
              ₹{item.pro_price * item.quantity}
            </div>

          </div>
        ))}
      </div>

      {/* RIGHT - SUMMARY */}
      <div className="cartSummary">
        <h3>Order Summary</h3>

        <div className="summaryRow">
          <span>Subtotal</span>
          <span>₹{total}</span>
        </div>

        <div className="summaryRow">
          <span>Delivery</span>
          <span>Free</span>
        </div>

        <div className="summaryTotal">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        <button 
            className="checkoutBtn"
            onClick={handleCheckout}
        >
          Proceed to Checkout
        </button>
      </div>

    </div>
  );
}

export default Cart;