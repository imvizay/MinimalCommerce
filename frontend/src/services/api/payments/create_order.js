
import api from "../../core/setup"
export const createOrder = (payload) => {
    return api.post('/cart-checkout/create-order/',payload)
}

export const verifyPayment = (payload) => {
    return api.post('/payments/cart/verify-payment/',payload)
}