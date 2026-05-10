
import api from "../../core/setup";

// action decorator api endpoint
export const createProductAPI = (payload) => {
    return api.post(`/products/admin/create_product/`, payload)
}