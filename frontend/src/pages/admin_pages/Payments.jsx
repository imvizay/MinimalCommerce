import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { loadPayments } from '@services/api/admin/admin'
import "@assets/css/admindashboard/admin_payments.css"

function Payments() {

  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isPending, isError } = useQuery({
    queryKey: ['payments', page],
    queryFn: () => loadPayments(page, limit),
    keepPreviousData: true
  })

  if (isPending) return <p>Loading payments...</p>
  if (isError) return <p>Error loading payments</p>

  const payments = data.results
  const totalPages = Math.ceil(data.count / limit)

  return (
    <div className="payments-container">

      <h2 className="section-title">Payments</h2>
    
    {/* SCROLLABLE CONTAINER */}
    <div className="payments-content">
      <div className="payments-grid">

        {payments.map(payment => {
          const order = payment.order
          const preview = order.preview_item

          return (
            <div key={payment.id} className="payment-card">

              {/* LEFT IMAGE */}
              <div className="payment-image">
                <img src={preview?.image} alt={preview?.name} />
              </div>

              {/* INFO */}
              <div className="payment-info">

                <div className="top-row">
                  <h3>{preview?.name}</h3>
                  <span className={`status ${payment.status}`}>
                    {payment.status}
                  </span>
                </div>

                <p className="order-id">Order #{order.id}</p>

                <div className="details">
                  <span>₹ {payment.amount}</span>
                  <span>{payment.provider}</span>
                </div>

                <div className="meta">
                  <span className={payment.is_paid ? "paid" : "not-paid"}>
                    {payment.is_paid ? "Paid" : "Unpaid"}
                  </span>
                  <span>{new Date(payment.created_at).toLocaleString()}</span>
                </div>

              </div>

            </div>
          )
        })}

      </div>
    </div>

      {/* PAGINATION */}
      <div className="pagination">

        <button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => {
          const pageNum = i + 1
          return (
            <button
              key={pageNum}
              className={page === pageNum ? "active-page" : ""}
              onClick={() => setPage(pageNum)}
            >
              {pageNum}
            </button>
          )
        })}

        <button
          disabled={!data.next}
          onClick={() => setPage(p => p + 1)}
        >
          Next
        </button>

      </div>

    </div>
  )
}

export default Payments