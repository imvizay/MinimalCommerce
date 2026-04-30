import { NavLink } from "react-router-dom"
import '@assets/css/admindashboard/admin_sidebar.css'

function AdminSidebar() {
  return (
    <div className="admin-sidebar">

      <h2 className="logo">Minimal-Commerce</h2>

      <nav>
        <NavLink to="/admindashboard">Dashboard</NavLink>
        <NavLink to="/admindashboard/users">Users</NavLink>
        <NavLink to="/admindashboard/products">Products</NavLink>
        <NavLink to="/admindashboard/orders">Orders</NavLink>
        <NavLink to="/admindashboard/payments">Payments</NavLink>
      </nav>

    </div>
  )
}

export default AdminSidebar