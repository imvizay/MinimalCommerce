

import api from "../../core/setup";
import { loadProducts } from "../products/products";

// load all products
export const adminLoadProducts = loadProducts

// load orders
export const adminloadOrders = (page=1,limit=5) => {
    return api.get(`/admin/orders/?page=${page}&limit=${limit}`);
}

// update order items before confirming order as per stock availiability

export const finalizeOrderAPI = (payload) => {
  console.log("Calling finalize order Api",payload)
  return api.post(`/admin/orders/finalize-order/`, payload)
}