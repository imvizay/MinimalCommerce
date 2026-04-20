
import api from "../../core/setup"

export const loadProducts = (filters) => {
    const params = {};

    if (filters.category) {
        params.category = filters.category;
    }

    // Price filters
    if (filters.price === "above ₹5000") {
        params.min_price = 5000;
    }

    if (filters.price === "above ₹10000") {
        params.min_price = 10000;
    }

    // Sorting
    if (filters.price === "high - low") {
        params.ordering = "-pro_price";
        params.sort = 'desc'
    }

    if (filters.price === "low - high") {
        params.ordering = "pro_price";
        params.sort = 'asc'
    }

    return api.get("products/list/", {
        params
    })
}