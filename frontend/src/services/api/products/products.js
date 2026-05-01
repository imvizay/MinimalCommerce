
import api from "../../core/setup"
export const loadProducts = (filters = {category:1}) => {
    const params = {}

    // category
    if(filters.category){
        params.category = Number(filters.category)
    }
    // sorting
    if(filters.price == "low - high"){
        params.order = "pro_price"
    }
    if(filters.price == "high - low"){
        params.order = "-pro_price"
    }
    // filtering
    if (filters.price === "above 5000") {
        params.min_price = 5000
    }
    if (filters.price === "above 10000") {
        params.min_price = 10000
    }
   
    return api.get('/products/list/',{
        params
    })
} 

export const loadCategories = () => {
    return api.get('/products/categories/')
}


// UserDashboard Product Services
/* fetch products on basis of product status */
export const fetchMyProducts = (status) => {
    return api.get(`/userdashboard/my-orders/?status=${status}`)
}

// pending order payments
export const loadPendingPayments = () => {
    return api.get(`/userdashboard/pending-payments/`)
}