import '@assets/css/userdashboard/userproductcard.css'
import { ArrowRightIcon } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

function UserProductCard({ order }) {

  const navigate = useNavigate()

  const {
    id,
    order_status,
    total,
    preview_item,
    total_item
  } = order

  return (
    <div className='ud-pc-container'>

      {/* TOP STATUS */}
      <div className='pc-status-and-date'>
        <span className={`pc-status ${order_status}`}>
          {order_status}
        </span>
        <span>|</span>
        <span className='pc-date'>
          {/* replace later with created_at */}
          Recent Order
        </span>
      </div>

      {/* MAIN CONTENT */}
      <div className='pc-information'>

        {/* LEFT */}
        <div className='pc-information-left'>

          {/* IMAGE */}
          <div className='pc-image'>
            <img 
              src={preview_item?.image} 
              alt={preview_item?.name} 
            />
          </div>

          {/* META */}
          <div className='pc-meta'>
            <h3 className='pc-identity'>
              Order #{id}
            </h3>

            <p className='pc-title'>
              {preview_item?.name}
            </p>

            <p className='pc-extra'>
              {total_item} item{total_item > 1 ? 's' : ''}
            </p>

            <span className='pc-price'>
              ₹ {total}
            </span>
          </div>
        </div>

        {/* RIGHT */}
        <div className='pc-information-right'>
          <button onClick={() => navigate(`/order/${id}`)}>
            <ArrowRightIcon size={18} />
          </button>
        </div>

      </div>
    </div>
  )
}

export default UserProductCard