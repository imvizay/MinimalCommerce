import '@assets/css/userdashboard/pendingpayments.css'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { loadPendingPayments } from '../../services/api/products/products'
import { RefreshCw } from 'lucide-react'

function PendingPayments() {

  const { data, isLoading, isError } = useQuery({
    queryKey: ['pending-payments'],
    queryFn: loadPendingPayments
  })

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Error loading data</p>

  if (!data || data.length === 0) {
    return <p>No pending payments</p>
  }

  return (
    <div className="pending-wrapper">

      {data.map((payment) => {
        const order = payment.order

        return (
          <div key={order.id} className="pending-card">

            {/* LEFT */}
            <div className="left">

              <img
                src={order.preview_item?.image}
                alt={order.preview_item?.name}
              />

              <div>
                <h4>{order.preview_item?.name}</h4>
                <p>{order.item_count} items</p>
                <span>₹ {payment.amount}</span>
              </div>

            </div>

            {/* RIGHT */}
            <div className="right">

              <span className="status">
                Payment Pending
              </span>

              <button
              className='retryButton'
                onClick={() => {
                  console.log("Retry payment for order:", order.id)
                }}
              >
                <RefreshCw size={14} />
                Retry
              </button>

            </div>

          </div>
        )
      })}

    </div>
  )
}

export default PendingPayments