

import api from "../../core/setup";
import { loadProducts } from "../products/products";

// load all products
export const adminLoadProducts = loadProducts

// load orders
export const adminloadOrders = () => {
    api.get('admin/orders/')
}

