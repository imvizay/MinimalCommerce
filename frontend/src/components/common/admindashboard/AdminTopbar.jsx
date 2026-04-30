import '@assets/css/admindashboard/admin_topbar.css'
import { useUserContext } from '@contexts/UserContext' 

function AdminTopbar() {
  const { isLoading,user,logoutUser } = useUserContext()

  

  return (
    <div className="admin-topbar">

      <div className="left">
       
      </div>

      <div className="right">
        <span>{isLoading ? "..." : user?.email.split('@')[0].toUpperCase() }</span>
        <button onClick={ () => logoutUser() }>Logout</button>
      </div>

    </div>
  )
}

export default AdminTopbar