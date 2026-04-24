
import api from "../../core/setup"
export const createOrder = (order) => {
    return api.post('/create-order/',order)
}