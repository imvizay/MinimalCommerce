import api from "../../core/setup"

// CREATE / UPDATE CART
export const saveCartIntoDb = (payload) => {
    return api.post('/cart/mycart/', payload)
}

// FETCH CART
export const loadCartFromDb = () => {
    return api.get('/cart/mycart/')
}