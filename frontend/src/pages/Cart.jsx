import React,{useState} from "react";
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

function Cart () {

  const [showLoginPrompt,setShowLoginPrompt] = useState(false)

  const { user } = useUserContext()
  const navigate = useNavigate()
  const checkoutId = getCheckoutId()



  const { 
    cart,
    updateQty, 
    removeFromCart,
    setCart } = useCart()
 
  const total = cart.reduce((acc, item) => acc + item.pro_price * item.quantity, 0);

  console.log("CART",cart)
 if (!cart || cart.length === 0) {
    return (
      <div className="cart-empty-container">
        <div className="cart-empty-card">
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven’t added anything yet.</p>

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
  const createOrderMutation = useMutation({
    mutationFn:createOrder,
    onSuccess: (data) => {
      console.log("Order Created Successfully.")
    },
    onError: (err) => {
      console.log("Order Creation Failed.")
    }
  })
 
  // Checkout 
  const handleCheckout = async () => {

    // authenticate user
    if(!user){
      setShowLoginPrompt(true)
      return
    }

    // load razorpay sdk
    const isLoaded = await loadRazorPayScript()
    if(!isLoaded){
      console.log("Razorpay SDK failed to load!")
      return
    }

    console.log("RP-script loaded.",isLoaded)
    console.log("RP-in window.",window.Razorpay)


    // create order api call
    const res = await createOrderMutation.mutateAsync({
      checkout_id:checkoutId,
      items : cart.map(item => ({
        id :item.id,
        quantity:item.quantity
      }))
   })

    const order = res
    console.log(`Order : ${JSON.stringify(order)}`)
  const options = {

    key:'rzp_test_Sh4FpWrz5ZqxWj',
    order_id:order.razorpay_order_id,
    amount:order.amount,
    currency:order.currency,
    name:"Minimal Commerce",
    description:'Order Payment',

    prefill:{
      name:user?.email.split('@')[0],
      contact:user?.contact
    },

    retry:{
      enabled:true
    },

    readonly: {
    email: true,
    contact: true
   },
  handler: async function (response) {  
      // verify payment
      try{
        console.log(`"RAZORPAY RESPONSE:" ${JSON.stringify(response)}`)
        await verifyPayment(response)

        // remove checkout id from localstorage once payment is done
        localStorage.removeItem('mc-checkoutId')
        localStorage.removeItem('cart')
        setCart([])
       
        alert("Payment Successfull")
      } catch(err){
        console.error("Verification Failed.",err)
      } 
    },
  }

  const rz = new Razorpay(options)
    rz.on('payment.failed',(response)=>{
      console.error('"Payment Failed:',response)
    })
    rz.open()
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