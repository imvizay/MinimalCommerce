import api from "../../core/setup"

// CREATE / UPDATE CART
export const saveCartIntoDb = (payload) => {
    return api.post('/cart/items/add_item/', payload)
}

// FETCH CART
export const loadCartFromDb = () => {
    return api.get('/cart/items/load_cart/')
}

// Remove Cart Item
export const removeCartItemFromDb = (id) => {
    return api.delete(`/cart/items/${id}/remove_item/`,)
}

// Update Cart Item
export const updateCartItemQuantity = (id,quantity) => {
    console.log("Running patch api endpoint",quantity)
    return api.patch(`/cart/items/${id}/update_cart/`,{
        quantity
    })
}