import { Outlet } from "react-router-dom"
import { useState } from "react"
import '@assets/css/admindashboard/admindashboard.css'
import AdminSidebar from "../components/common/admindashboard/AdminSidebar"
import AdminTopbar from "../components/common/admindashboard/AdminTopbar"

function Admindasboard() {

  const [open, setOpen] = useState(false)

  return (
    <div className="admin-layout">

      {/* Sidebar becomes drawer */}
      <AdminSidebar open={open} setOpen={setOpen} />

      <div className="admin-main">

        {/* Topbar always visible */}
        <AdminTopbar setOpen={setOpen} />

        <div className="admin-content">
          <Outlet />
        </div>

      </div>

    </div>
  )
}

export default Admindasboard