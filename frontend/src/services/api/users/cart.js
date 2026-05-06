import api from "../../core/setup"

// CREATE / UPDATE CART
export const saveCartIntoDb = (payload) => {
    return api.post('/cart/items/add_item/', payload)
}

// FETCH CART
export const loadCartFromDb = () => {
    return api.get('/cart/items/load_cart/')
}