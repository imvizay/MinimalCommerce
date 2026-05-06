import { createContext, useContext, useState, useEffect,useRef } from "react"
import { useUserContext } from "./UserContext"
import { useMutation, useQuery } from "@tanstack/react-query"
import { loadCartFromDb, saveCartIntoDb,removeCartItemFromDb,updateCartItemQuantity } from "../services/api/users/cart"

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [loadingId, setLoadingId] = useState(null)
  const [loading,setLoading] = useState(true)
  const debounceRef = useRef({})

  const { user } = useUserContext()
    
  // Load cart from db
  const { data, isPending } = useQuery({
    queryKey: ["cart", user?.id],
    queryFn: loadCartFromDb,
    enabled: !!user, // only run when user exists
  })

  // ======== REMOVE CART ITEM DB ==============
  const cartMutation = useMutation({
    mutationFn:(id)=>removeCartItemFromDb(id),
    onSuccess:() => console.log("remove item from cart"),
    onError:(err)=> console.log("failed to remove cart item",err)
  })

  // ========= UPDATE CART QTY DB =============
  const cartQtyMutation = useMutation({
    mutationFn: ({id,quantity}) => updateCartItemQuantity(id,quantity),
    onSuccess: () => console.log('updated quantity.'),
    onError: (err) => console.log('something went wrong',err)

  })


  // ====== FETCH/SET DB CART ==========
  useEffect(() => {
    if (user && data) {
      setCart(data?.cart_items || [])
      setLoading(false)
    }
    console.log("Context cart:",cart)
  }, [data, user])

  // ======= MERGE GUEST CART INTO DB ========= 
  useEffect(() => {
    const mergeCart = async () => {
      try {
        if (user) {
          let guestCart = localStorage.getItem("cart")

          if (guestCart && guestCart !== "undefined") {
            guestCart = JSON.parse(guestCart)

            for (const item of guestCart) {
              await saveCartIntoDb({
                product_id: item.id,
                variant_id: null,
                quantity: item.quantity || 1, 
              })
            }

            localStorage.removeItem("cart")
          }
        } else {
          const storedCart = localStorage.getItem("cart")

          if (storedCart && storedCart !== "undefined") {
            setCart(JSON.parse(storedCart))
          }
        }
      } catch (err) {
        console.log("Error loading cart", err)
      }
    }

    mergeCart()
  }, [user])

  // Sync localStorage only for guest
  useEffect(() => {
    if (!user) {
      localStorage.setItem("cart", JSON.stringify(cart))
      setLoading(false)
    }
  }, [user, cart])

  //============== ADD TO CART ================
  const addToCart = async (product) => {
    if (loadingId === product.id) return
    setLoadingId(product.id)

    if (user) {
      try {
        const data = await saveCartIntoDb({
          product_id: product.id,
          variant_id: null,
          quantity: 1,
        })
        
      } catch (err) {
        console.log("Failed to add to cart", err)
      }

      setLoadingId(null)
      return
    }

    // Guest cart
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id)

      if (existing?.quantity >= 10) return prev

      if (existing) {
        return prev.map((p) =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        )
      }

      return [...prev, { ...product, quantity: 1 }]
    })

    setTimeout(() => setLoadingId(null), 300)
  }

  // ============ REMOVE CART ITEM =================
  const removeFromCart = (id) => {
    if(!user){
      setCart((prev) => prev.filter((item) => item.id !== id))
    }
    cartMutation.mutate(id)
  }

  // =========== UPDATE CART =====================
  /* implement rollback for cart item quantity where ui shows updated quantity but api failed and that leads data mismatch between frontend and backend  */
  const updateQty = (productId, delta) => {

      console.log("DELTA",delta)

      let updatedQuantity = 1;
      let previousQuantity = 1; 

      // OPTIMISTIC UI INSTANT UPDATE
      setCart( prev => 
        prev.map( item => {

          if(item.id == productId){
            previousQuantity = item.quantity
            updatedQuantity = Math.min(10,Math.max(1,item.quantity + delta))
            return {
              ...item,
              quantity:updatedQuantity
            }
          }
          return item
        })
      )
      
      // upto this point return as user is a guest
      if(!user) return 

      // clear existing timeout for this cart item
      if(debounceRef.current[productId]){
        clearTimeout(debounceRef.current[productId])
      }

      // UPDATE QUANTITY INTO DB
      debounceRef.current[productId] = setTimeout(() => {
        cartQtyMutation.mutate(
          {
           id: productId,
           quantity: updatedQuantity,
          },
          {
            onError: () => {
              // ROLLBACK OPTIMISTIC CHANGES
              setCart(prev => 
                prev.map(item => {
                  if(item.id == productId){
                    return{
                      ...item,
                      quantity:previousQuantity
                    }
                  }
                  return item
                })
              )
            }
          }
      )
      }, 500)
  }

  const totalCartItems = cart?.length ?? 0

  return (
    <CartContext.Provider
      value={{
        loading: isPending, 
        cartLoading:loading,
        cart,
        setCart,
        loadingId,
        totalCartItems,
        updateQty,
        addToCart,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// Hook
export const useCart = () => {
  return useContext(CartContext)
}