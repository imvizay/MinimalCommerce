import React, { useState } from "react"
import { useLocation } from "react-router-dom"
import "@assets/css/admindashboard/order_detail.css"

import { useMutation } from "@tanstack/react-query"

import { finalizeOrderAPI } from '@services/api/admin/dashboard.js'

const OrderDetail = () => {
  const { state: order } = useLocation()

  const [updatedItems, setUpdatedItems] = useState({})

  if (!order) return <p className="no-data">No Order Data Found</p>

  // Handle item status update
  const handleUpdateItem = (id, status) => {
    setUpdatedItems((prev) => ({
      ...prev,
      [id]: status,
    }))
  }

  // Finalize Order Mutation
  const finalizeOrder = useMutation({
    mutationFn: () => {
      const payload = {
        order_id: order.id,
        items: order.order_items.map((item) => ({
          id: item.id,
          status: updatedItems[item.id] || item.status || "pending",
        })),
      }

      finalizeOrderAPI(payload)
    },

    onSuccess: (data) => {
      alert(`Order finalized. Refund: ₹${data?.refund_amount || 0}`)
    },

    onError: () => {
      alert("Something went wrong while finalizing order")
    },
  })

  return (
    <div className="order-detail-container">
      <h2 className="order-title">Order #{order.id}</h2>

      {/* Order Summary */}
      <div className="order-summary">
        <p><strong>Status:</strong> {order.order_status}</p>
        <p><strong>Total:</strong> ₹{order.total}</p>
        <p>
          <strong>Date:</strong>{" "}
          {new Date(order.created_at).toLocaleString()}
        </p>
      </div>

      {/* Order Items Table */}
      <table className="order-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Stock</th>
            <th>Price</th>
            <th>Status</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {order.order_items.map((item) => {
            const stock = item.product.stock

            //  current status (updated OR original)
            const currentStatus =
              updatedItems[item.id] || item.status || "pending"

            //  status color
            let statusClass = "status-pending"
            if (currentStatus === "confirmed") statusClass = "status-success"
            if (currentStatus === "cancelled") statusClass = "status-danger"

            return (
              <tr key={item.id}>
                <td>{item.product.pro_name}</td>
                <td>{item.quantity}</td>
                <td>{stock}</td>
                <td>₹{item.product.pro_price}</td>
                <td className={statusClass}>{currentStatus}</td>
                <td>₹{item.quantity * item.product.pro_price}</td>

                <td className="item-actions">
                  <div className="btn">
                    <button
                      className={`btn-cancel ${
                        currentStatus === "cancelled" ? "active" : ""
                      }`}
                      onClick={() =>
                        handleUpdateItem(item.id, "cancelled")
                      }
                    >
                      Cancel
                    </button>

                    <button
                      className={`btn-confirm ${
                        currentStatus === "confirmed" ? "active" : ""
                      }`}
                      onClick={() =>
                        handleUpdateItem(item.id, "confirmed")
                      }
                    >
                      Confirm
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Final Actions */}
      <div className="order-actions">
        <button
          className="btn btn-confirm"
          onClick={() => finalizeOrder.mutate()}
          disabled={finalizeOrder.isPending}
        >
          {finalizeOrder.isPending ? "Processing..." : "Finalize Order"}
        </button>
      </div>
    </div>
  )
}

export default OrderDetail