import React from 'react'
import '@assets/css/userdashboard/order_details.css'
import { useQuery } from '@tanstack/react-query'
import { loadMyOrderItems } from '@services/api/products/products'
import { useParams } from 'react-router-dom'

function UserOrderDetails() {

  const { id } = useParams()

  const { data, isPending, isError } = useQuery({
    queryKey: ['order_items', id],
    queryFn: () => loadMyOrderItems(id),
    enabled: !!id
  })

  if (isPending) return <div>Loading...</div>
  if (isError) return <div>Something went wrong</div>

  const order = data
  const items = data?.order_items || []

  return (
    <div className="order-details">

      {/* ORDER HEADER */}
      <div className="order-header">
        <h2>Order #{order.id}</h2>

        <span className={`order-status ${order.order_status}`}>
          {order.order_status.replace('_', ' ')}
        </span>
      </div>

      {/* ITEMS */}
      <div className="order-items">

        {items.length === 0 ? (
          <p>No items found</p>
        ) : (
          items.map(item => {

            const image = item.product?.images?.[0]?.image

            return (
              <div key={item.id} className="order-item-card">

                {/* IMAGE */}
                <div className="item-img">
                  <img src={image} alt={item.product?.pro_name} />
                </div>

                {/* INFO */}
                <div className="item-info">
                  <h3>{item.product?.pro_name}</h3>

                  <p className="meta">
                    Qty: {item.quantity} • ₹ {item.price}
                  </p>

                  {/* ITEM STATUS */}
                  <span className={`item-status ${item.status}`}>
                    {item.status}
                  </span>
                </div>

              </div>
            )
          })
        )}

      </div>

    </div>
  )
}

export default UserOrderDetails