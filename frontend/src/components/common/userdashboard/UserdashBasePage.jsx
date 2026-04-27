
import React, { useEffect } from 'react'
// components
import UserProductCard from '../../cards/UserdashboardProductCard'
import { ArrowDownNarrowWideIcon ,Home, ChevronRight } from "lucide-react";

// react router
import { Link } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom';

// tanstack query
import { useQuery } from '@tanstack/react-query'
import { fetchMyProducts } from '../../../services/api/products/products';

const productsStatusPills = [
    'all','pending','confirmed','shipped','delivered','cancelled'
]

function UserdashboardHome() {

    const [searchParams,setSearchParams] = useSearchParams()

    let status = searchParams.get("status") || 'all' 


    const {data:products,isLoading,isError} = useQuery({
        queryKey:['products',status],
        queryFn: () => fetchMyProducts(status)
    }) 

    


    // HANDLE FILTER TYPE 
    const handleOrderFilterList = (e) => {
        // console.log("E:",e)
        const type = e.target.dataset.status
        setSearchParams({
            status:type
        })
    }


  return (
    <>
        <div className='dash-right-top breadcrumb-bar'>
               
        </div>
        {/* Product Status Filter Pills  */}
        <div className='dash-right-center filter-product-status'>
            <div onClick = { handleOrderFilterList } className='opt-pills'>
                {productsStatusPills.map((element,key) => (
                    <button 
                        data-status = {element} 
                        key = {key}
                        className={ status == element ? "activeStatusType" : ""}
                        > 
                        {element} 
                        </button>
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