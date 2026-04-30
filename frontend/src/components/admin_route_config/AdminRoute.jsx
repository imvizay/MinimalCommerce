
import { Navigate, Outlet } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContext";

function AdminRoute() {
    const { user,isLoading } = useUserContext()

    if(isLoading) return <div>Loading ...</div>

    if(!user) return <Navigate to='/login' replace/>

    if(!user?.is_superuser) return <Navigate to='/' replace/>

    return <Outlet/>
}

export default AdminRoute