
import React, { useEffect } from 'react'
// components
import UserProductCard from '../../cards/UserdashboardProductCard'
import { ArrowDownNarrowWideIcon ,Home, ChevronRight } from "lucide-react";

// react router
import { Link } from 'react-router-dom'

const productsStatusPills = [
    'all','pending','confirmed','shipped','delivered','cancelled'
]

function UserdashboardHome() {


  return (
    <>
        <div className='dash-right-top breadcrumb-bar'>
               
        </div>
        {/* Product Status Filter Pills  */}
        <div className='dash-right-center filter-product-status'>
            <div className='opt-pills'>
                {productsStatusPills.map((element,key) => (
                    <button key={key}>{element}</button>
                ))}
            </div>
            
            {/* Date based filter */}
            <div className='date-filter'>
                <button>Select date range <ArrowDownNarrowWideIcon size={13}/></button>
            </div>
        </div>
        <div className='dash-right-bottom dash-prouducts-list'>
                <UserProductCard/>
        </div>
    </>
  )
}

export default UserdashboardHome