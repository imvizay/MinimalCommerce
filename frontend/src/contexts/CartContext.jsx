

import { createContext,useContext } from "react";
import { useState,useEffect } from "react";

export const CartContext = createContext()

export const CartProvider = ({children}) => {

    const [cart,setCart] = useState([])
    const [loadingId,setLoadingId] = useState(null)

    // load cart initially as guest 
    useEffect(()=>{
        const storedCart = JSON.parse(localStorage.getItem('cart')) ?? []
        setCart(storedCart)        
    },[])

    
    useEffect(()=>{
        localStorage.setItem("cart",JSON.stringify(cart))
        console.log("UPDATED CART:", cart)
    },[cart])

    // add to cart
    const addToCart = (product) => {

        if(loadingId == product.id) return
        setLoadingId(product.id)

        setCart( prev => {
            const existing  = prev.find( p => p.id == product.id)

            if(existing?.quantity >=10 ){
                return prev
            }

            if(existing){
                return prev.map( p => 
                    p.id == product.id ? 
                    {...p, quantity:p.quantity + 1 } : p 
                 )
            }
            return[...prev, {...product, quantity:1 }]
        })

        const timeout = setTimeout(() => {
            setLoadingId(null)
        }, 300)
    }

    // Remove Cart Item
    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id))
    }

    // UPDATE Cart Items Quantity
    const updateQty = (productId, delta) => {

        setCart(prev =>
            prev.map(item =>
                item.id === productId
                    ? {
                        ...item,
                         quantity: Math.min(
                                    10, // max limit
                                    Math.max(1, item.quantity + delta) // min limit
                                )
                      }
                    : item
            )
        )
    }

    const totalCartItems = cart?.length ?? 0 

    return (
        <CartContext.Provider value={{cart, setCart, loadingId,totalCartItems,updateQty ,addToCart, removeFromCart}} >
            {children}
        </CartContext.Provider>
    )
}

// Use Cart Hook
export const useCart = () => {
    return useContext(CartContext)
}