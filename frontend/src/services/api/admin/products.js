
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