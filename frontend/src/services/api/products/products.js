
import api from "../../core/setup"
export const loadProducts = () => {
    return api.get('/products-list/')
} 