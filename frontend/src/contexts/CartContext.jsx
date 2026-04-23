

import { createContext,useContext } from "react";
import { useState,useEffect } from "react";

export const CartContext = createContext()

export const CartProvider = ({children}) => {

    const [cart,setCart] = useState()
    const [loadingId,setLoadingId] = useState(null)

    // load cart initially as guest 
    useEffect(()=>{
        const storedCart = JSON.parse(localStorage.getItem('cart')) || []
        setCart(storedCart)
    },[])

    // 
    useEffect(()=>{
        localStorage.setItem("cart",JSON.stringify(cart))
    },[cart])

    // add to cart
    const addToCart = (product) => {

        if(loadingId == product.id) return
        setLoadingId(product.id)

        setCart( prev => {
            const existing  = prev.find( p => p.id == product.id)
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

    // remove cart item
    const removeFromCart = (id) => {
        setCart(prev => {
            prev.filter(prev => prev.id !== id)
        })
    }

    return (
        <CartContext.Provider value={{cart, loadingId, addToCart, removeFromCart}} >
            {children}
        </CartContext.Provider>
    )
}

// Use Cart Hook
export const useCart = () => {
    return useContext(CartContext)
}