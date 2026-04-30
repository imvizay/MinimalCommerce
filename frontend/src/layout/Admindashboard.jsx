
import { Outlet } from "react-router-dom"
import '@assets/css/admindashboard/admindashboard.css'
import AdminSidebar from "../components/common/admindashboard/AdminSidebar"
import AdminTopbar from "../components/common/admindashboard/AdminTopbar"

function Admindasboard() {
  return (
    <div className="admin-layout">

      <div>
        <AdminSidebar />
      </div>

      <div className="admin-main">

        <AdminTopbar />

        <div className="admin-content">
          <Outlet />
        </div>

      </div>

    </div>
  )
}

export default Admindasboard