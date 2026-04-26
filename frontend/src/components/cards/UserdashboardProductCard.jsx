import '@assets/css/userdashboard/userproductcard.css'

import { ArrowLeftIcon } from 'lucide-react'
import React from 'react'


function UserProductCard() {
  return (
    <div className='ud-pc-container'>
        <div className='pc-status-and-date'>
            <span className='pc-status'>
                in progress
            </span>
            <span>|</span>
            <span className='pc-date'>10 May 2025</span>
        </div>

        <div className='pc-information'>
           <div className='pc-information-left'>
                <div className='pc-image'>
                    <img alt="" />
                </div>
                <div className='pc-meta'>
                    <h1 pc-identity>Order Id- ABC-6457321</h1>
                    <p pc-title>Mens Blue leather Jacket </p>
                    <span className='pc-price'>12,000</span>
                </div>
           </div>

           <div className='pc-information-right'>
            <button>
                <ArrowLeftIcon/>
            </button>
           </div>
        </div>
    </div>
  )
}

export default UserProductCard