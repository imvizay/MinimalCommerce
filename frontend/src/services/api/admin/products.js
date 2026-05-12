
import api from "../../core/setup";


// action decorator api endpoint
export const createProductAPI = (payload) => {
    return api.post(`/products/admin/createproduct/`, payload)
}


// bulk create 
export const createBulkProductAPI = (payload) => {
    console.log("BULK CREATION API in-progress")
    return api.post(`/products/admin/bulkcreate/`,payload)
}

// edit product

export const singleProductAPI = (id) => {
    return api.get(`/products/admin/${id}/`)
}

export const updateProductAPI = (id,data) => {
    return api.put(`/products/admin/${id}/`,data)
} 

export const removeProductAPI = (id) => {
    return api.delete(`/products/admin/${id}/`)
}