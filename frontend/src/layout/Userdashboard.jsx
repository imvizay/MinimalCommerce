import '@assets/css/userdashboard/userdashboard.css'

import React,{useState} from 'react'
import { Outlet,useNavigate } from 'react-router-dom'
import { useUserContext } from '../contexts/UserContext'
import { useCart } from '@contexts/CartContext'

// components
import { Menu,MapPin,CircleUser, ShoppingBag,X } from 'lucide-react'
import Breadcrumb from '@components/common/breadcrumb/Breadcrumb'



const userDashboardNavLinks = [
  { id: 1, name: 'My Profile', to: "" },              // index route
//   { id: 2, name: 'My Orders', to: `/userdashboard/my-orders` },
  { id: 3, name: 'Pending Payments', to: "/userdashboard/pending-payments" },
//   { id: 4, name: 'Order History', to: "/userdashboard/order-history" },
//   { id: 5, name: 'Customer Care', to: "/userdashboard/customer-care" },
]


function Userdashboard() {
    const { user,logoutUser } = useUserContext()
    const {cart} = useCart()
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()

    const handleLogout = () => {
        logoutUser()
        navigate('/login')
    }

  return (
    <>
    <div className='dashboardContainer'>

        {/* Userdashboard top bar */}
        <div className='dash-nav'>
            <div className='nav-left nav-menu'>
                <button onClick={() => setOpen(prev=>!prev)}>{open ? <X/> : <Menu/>}</button>
                <p><MapPin color='red' size={13}/> <span>{user?.address}</span></p>
            </div>
            <div className='nav-center nav-logo'>
                <span onClick={()=>navigate('/')}>Minimal Commerce</span>
            </div>     

            <div className='nav-right nav-user-info'>
              <div className='user'>
                <span><CircleUser/></span>
                <span>{user?.email?.split('@')[0] || ''}</span>
              </div>
              <button onClick={()=>navigate('/userdashboard/my-cart')}> <ShoppingBag/> <span className='item-count'>{cart.length || 0}</span> </button>
            </div>
        </div>

        {/* USER DASHBOARD NAVLINKS SIDEBAR */}
        <div className={`dash-left ${open ? "open" : ""}`}>

            <div className='dash-links-container'>
            {userDashboardNavLinks.map(el => (
                
                <button 
                    className='ud-link'
                    key={el.id}
                    onClick={()=>{
                        navigate(el.to)
                        setOpen(prev=>!prev)
                    }}
                    >
                        {/* <span>{<el.icon/>}</span> */}
                        {el.name}
                </button>
            ))}
            </div>

            <div className='dash-left-user-actions'>
                <button onClick={handleLogout}> Logout </button>
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