
 import { useState, useEffect } from "react";
import { createContext,useContext } from "react";

export const UserContext = createContext()

export const UserProvider = ({children}) => {

    const [user,setUser] = useState(null)
    const [isLoading,setLoading] = useState(true)

    useEffect(()=>{
       const storedUser = JSON.parse(localStorage.getItem('mc-user'))
       if(storedUser){
        setUser(storedUser)
       }
       setLoading(false)
    },[])

    // save user
    const saveUser = (u) => {
       setUser(u)
       localStorage.setItem('mc-user', JSON.stringify(u))
    }

    // remove user and show logout
    const logoutUser = () => {
        setUser(null)
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        localStorage.removeItem('mc-user')
    }

    return (
        <UserContext.Provider value={{user,saveUser,logoutUser,isLoading}}>
        {children}
        </UserContext.Provider>
    )
}

export const useUserContext = () => {
    return useContext(UserContext)
}