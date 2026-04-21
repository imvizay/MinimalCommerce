
import api from "../../core/setup"
export const loadProducts = (filters) => {
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