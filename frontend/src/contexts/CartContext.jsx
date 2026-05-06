import { createContext, useContext, useState, useEffect } from "react"
import { useUserContext } from "./UserContext"
import { useQuery } from "@tanstack/react-query"
import { loadCartFromDb, saveCartIntoDb } from "../services/api/users/cart"

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [loadingId, setLoadingId] = useState(null)
  const [loading,setLoading] = useState(true)

  const { user } = useUserContext()
    
  const { data, isPending } = useQuery({
    queryKey: ["cart", user?.id],
    queryFn: loadCartFromDb,
    enabled: !!user, // only run when user exists
  })

  // Set cart from DB correctly
  useEffect(() => {
    if (user && data) {
      setCart(data?.cart_items || [])
      setLoading(false)
    }
    console.log("Context cart:",cart)
  }, [data, user])

  // Merge guest cart --> DB 
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
    }
  }, [user, cart])

  // Add to cart 
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

  // Remove item
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  // Update quantity
  const updateQty = (productId, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: Math.min(
                10,
                Math.max(1, item.quantity + delta)
              ),
            }
          : item
      )
    )
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