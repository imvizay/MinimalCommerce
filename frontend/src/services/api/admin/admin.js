

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


// Fetch all users
export const loadUsers = (page,limit=20) => {
  return api.get(`/users/admin/?page=${page}&limit=${limit}`)
}


// fetch all products
export const loadAdminProducts = (page=1,limit=10) => {
  return api.get(`/products/admin/?page=${page}&limit=${limit}`)
}

// fetch all payments
export const loadPayments = (page=1,limit=10) => {
  return api.get(`/payments/all/?page=${page}&limit=${limit}`)
}