import React,{useEffect, useState} from "react";
import "@/assets/css/cart/cart.css"; 

import { useCart } from "../contexts/CartContext";
import { useUserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import LoginPromptModal from "../components/LoginPrompt";

// razorpay script
import { loadRazorPayScript } from "../utils/loadRazorpayScript";

// tanstack query
import { createOrder, verifyPayment } from "../services/api/payments/create_order";
import { useMutation } from '@tanstack/react-query'

// checkout session id
import { getCheckoutId } from "../utils/checkoutId";

function Cart() {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  const { user } = useUserContext()
  const navigate = useNavigate()
  const checkoutId = getCheckoutId()

  const { 
    cartLoading,
    loading,
    cart,
    updateQty, 
    removeFromCart,
    setCart 
  } = useCart()

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => console.log("Order Created Successfully."),
    onError: (err) => console.log("Order Creation Failed.",err.response.data)
  })


  const total = cart.reduce((acc, item) => acc + item.pro_price * item.quantity, 0)

  if (cartLoading) return <div>Cart loading...</div>

  console.log("CART",cart)
  if (!cart || cart.length === 0) {
    return <div>Empty Cart</div>
  }

  if (!cart || cart.length === 0) {
     return (
       <div className="cart-empty-container">
         <div className="cart-empty-card">
           <h2>Your Cart is Empty</h2>
           <p>Looks like you haven't added anything yet.</p>
 
           <button
             className="cart-empty-btn"
             onClick={() => (window.location.href = "/")}
           >
             Browse Products
           </button>
         </div>
       </div>
     )
   }
   
 
  // Checkout 
  const handleCheckout = async () => {

    try {
      // Ensure user is logged in
      if (!user) {
        setShowLoginPrompt(true)
        return
      }

      // Load Razorpay SDK dynamically
      const isLoaded = await loadRazorPayScript()

      if (!isLoaded) {
        console.error("Razorpay SDK failed to load")
        alert("Payment service unavailable. Try again later.")
        return
      }

      // Create order from backend
      const order = await createOrderMutation.mutateAsync({
        checkout_id: checkoutId
      })

      // Critical safety check
      if (!order?.razorpay_order_id) {
        console.error("Invalid order response:", order)
        alert("Order creation failed. Please try again.")
        return
      }

      console.log("Backend Order:", order)

      // Configure Razorpay
      const options = {
        key: 'rzp_test_Sh4FpWrz5ZqxWj',
        order_id: order.razorpay_order_id,
        amount: order.amount,
        currency: order.currency,

        name: "Minimal Commerce",
        description: "Order Payment",

        // Prefill user details
        prefill: {
          name: user?.email?.split('@')[0] || "User",
          contact: user?.contact || ""
        },

        retry: { enabled: true },

        readonly: {
          email: true,
          contact: true
        },

        /**
         * Payment success handler
         * Called when user completes payment
        */
        handler: async function (response) {
          try {
            console.log("Razorpay Response:", response)

            await verifyPayment(response)

            // Clean up client state after success
            localStorage.removeItem('mc-checkoutId')
            localStorage.removeItem('cart')

            setCart([])

            alert("Payment Successful")

          } catch (err) {
            console.error("Payment verification failed:", err)
            alert("Payment verification failed. Contact support.")
          }
        }
      }

      // Open Razorpay UI
      const rz = new window.Razorpay(options)

      // Payment failure handler
      rz.on('payment.failed', (response) => {
        console.error("Payment Failed:", response)
        alert("Payment failed. Please try again.")
      })

      rz.open()

    } catch (err) {
      console.error("Checkout error:", err)
      alert("Something went wrong during checkout.")
    }
  }
    
  return (
    <div className="cartWrapper">

    {/* If User Not Logged in overlay this  */}
       {showLoginPrompt &&  <LoginPromptModal onClose={setShowLoginPrompt}/>}


      {/* LEFT - ITEMS */}
      <div className="cartItems">
        {cart.map(item => (
          <div key={item.id} className="cartCard">

            <img src={item.preview_image || item.images?.[0]?.image} />

            <div className="cartDetails">
              <h3>{item.product_name || item.pro_name}</h3>
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