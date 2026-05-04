import React from 'react'

// routes components
import { Routes,Route } from 'react-router-dom'

// route components
import Navbar from '@components/common/Navbar'

// forms
import Login from '@components/forms/Login'
import Signup from '@components/forms/Register'
import Base from './layout/Base'
import DisplayProducts from '@pages/DisplayProducts'
import Cart from '@pages/Cart'

// user dashboard
import Userdashboard from '@pages/MyProfile'
import UserdashboardHome from '@components/common/userdashboard/UserdashBasePage'
import PendingPayments from '@pages/userdashboard_pages/PendingPayments'

// admindashboard
import Admindashboard from './layout/Admindashboard'
import AdminRoute from '@components/admin_route_config/AdminRoute'
import AdminHome from '@pages/admindashboard/AdminHome'
import OrderDetail from './pages/admindashboard/OrderDetail'
import UsersList from './pages/admindashboard/UsersList'
import AdminProducts from './pages/admindashboard/Products'
import Payments from './pages/admindashboard/Payments'


function App() {
  return (
    <>
    <Routes>

      {/* Base Routes */}
      <Route path='/' element={<Base/>}>
        <Route index element = {<DisplayProducts/>}></Route>
        <Route path='login' element={<Login/>}/>
        <Route path='signup' element={<Signup/>}/>
        <Route path='cart' element={<Cart/>}></Route>
      </Route>


      {/* Userdashboard Routes  */}
      <Route path="/userdashboard" element={<Userdashboard />}>
        <Route index element={<UserdashboardHome />} />

        <Route path="pending-payments" element={<PendingPayments />} />
        {/* <Route path="my-orders" element={<UserOrders />} />
        <Route path="order-history" element={<OrderHistory />} />
        <Route path="customer-care" element={<CustomerCare />} /> */}
      </Route>

      {/* Admindashboard Routes */}
      <Route element={<AdminRoute/>}>
        <Route path='/admindashboard' element={<Admindashboard/>}>

            <Route index element={<AdminHome/>}/>
             <Route path='users' element={<UsersList/>} />
            <Route path='products' element={<AdminProducts/>}/>
            <Route path='order-detail/:id' element={<OrderDetail/>}/>
            <Route path='payments' element={<Payments/>}/>
            
        </Route>
      </Route>

    </Routes>
    </>
  )
}

export default App