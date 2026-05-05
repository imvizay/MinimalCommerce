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
import Userdashboard from './layout/Userdashboard'
import Ud_IndexComponent from '@components/common/ud_index_compo/Ud_IndexComponent'
import PendingPayments from '@pages/ud_pages/PendingPayments'
import UserOrderDetails from './pages/ud_pages/UserOrderDetails'

// admindashboard
import Admindashboard from './layout/Admindashboard'
import AdminRoute from '@components/admin_route_config/AdminRoute'
import AdminHome from '@pages/admin_pages/AdminHome'
import UsersList from './pages/admin_pages/UsersList'
import AdminProducts from './pages/admin_pages/Products'
import Payments from './pages/admin_pages/Payments'
import AdminOrderDetail from './pages/admin_pages/AdminOrderDetail'


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
        <Route index element={<Ud_IndexComponent />} />

        <Route path="pending-payments" element={<PendingPayments />} />
        
        <Route path="my-order-items/:id" element={<UserOrderDetails />} />
        <Route path="my-cart" element={<Cart />} />

        {/* <Route path="order-history" element={<OrderHistory />} /> */}
        {/* <Route path="customer-care" element={<CustomerCare />} /> */}
      </Route>

      {/* Admindashboard Routes */}
      <Route element={<AdminRoute/>}>
        <Route path='/admindashboard' element={<Admindashboard/>}>

            <Route index element={<AdminHome/>}/>
             <Route path='users' element={<UsersList/>} />
            <Route path='products' element={<AdminProducts/>}/>
            <Route path='order-detail/:id' element={<AdminOrderDetail/>}/>
            <Route path='payments' element={<Payments/>}/>
            
        </Route>
      </Route>

    </Routes>
    </>
  )
}

export default App