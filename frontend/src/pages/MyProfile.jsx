import '@assets/css/userdashboard/userdashboard.css'

import React from 'react'
import { Outlet,useNavigate } from 'react-router-dom'

// components
import { Menu,MapPin,CircleUser, ShoppingBag } from 'lucide-react'
import Breadcrumb from '../components/common/breadcrumb/Breadcrumb'

const userDashboardNavLinks = [
  { id: 1, name: 'My Profile', to: "" },              // index route
  { id: 2, name: 'My Orders', to: "/userdashboard/my-orders" },
  { id: 3, name: 'Pending Payments', to: "/userdashboard/pending-payments" },
  { id: 4, name: 'Order History', to: "/userdashboard/order-history" },
  { id: 5, name: 'Customer Care', to: "/userdashboard/customer-care" },
]


function Userdashboard() {
    const navigate = useNavigate()
  return (
    <>
    <div className='dashboardContainer'>
        
        {/* Userdashboard top bar */}
        <div className='dash-nav'>
            <div className='nav-left nav-menu'>
                <button><Menu/></button>
                <p><MapPin color='red' size={13}/> <span>Bagoniya,Bhopal</span></p>
            </div>
            <div className='nav-center nav-logo'>
                <span onClick={()=>navigate('/')}>Minimal Commerce</span>
            </div>     

            <div className='nav-right nav-user-info'>
              <div className='user'>
                <span><CircleUser/></span>
              </div>
              <button> <ShoppingBag/> <span className='item-count'>10000</span> </button>
            </div>
        </div>

        {/* USER DASHBOARD NAVLINKS SIDEBAR */}
        <div className='dash-left'>
            <div className='dash-links-container'>
            
            {userDashboardNavLinks.map(el => (
                <button 
                    className='ud-link'
                    key={el.id}
                    onClick={()=>navigate(el.to)}
                    >
                        {/* <span>{<el.icon/>}</span> */}
                        {el.name}
                </button>
            ))}
            </div>
        </div>

        {/* Userdashboard Outlet Section */}
        <div className='dash-right'>
            {/* childrens outlet */}
            <Breadcrumb/>
            <Outlet/>
        </div>
    </div>
    </>
  )
}

export default Userdashboard