import { NavLink } from "react-router-dom"
import '@assets/css/admindashboard/admin_sidebar.css'

import { useUserContext } from "@contexts/UserContext"


export default function AdminSidebar({ open, setOpen }) {
  const { user,logoutUser } = useUserContext()
  return (
    <>
      {/* overlay */}
      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      <div className={`admin-sidebar ${open ? "open" : ""}`}>

        <h2 className="logo">Minimal-Commerce</h2>

        <nav>
          <NavLink  to="/admindashboard"  
            className={({ isActive }) => isActive ? "link active-home" : "link"}  
            onClick={()=>setOpen(false)}>  Dashboard</NavLink>

          <NavLink  to="/admindashboard/users"  
            className={({ isActive }) => isActive ? "link active" : "link"}     
            onClick={()  =>setOpen(false)}>  Users</NavLink>

          <NavLink  to="/admindashboard/products"  
            className={({ isActive }) => isActive ? "link active" : "link"}  
            onClick=  {()=>setOpen(false)}>  Products</NavLink>

          <NavLink  to="/admindashboard/orders"  
            className={({ isActive }) => isActive ? "link active" : "link"}  
            onClick={(  )=>setOpen(false)}>  Orders</NavLink>

          <NavLink  to="/admindashboard/payments"  
            className={({ isActive }) => isActive ? "link active" : "link"}  
            onClick=  {()=>setOpen(false)}>  Payments</NavLink>
        </nav>

        <div className="admin-info">
          <span>{user.email.split('@')[0].toUpperCase()}</span>
           <button onClick={()=>logoutUser()} className="logout-btn">Logout</button>
        </div>
      
      </div>
    </>
  )
}