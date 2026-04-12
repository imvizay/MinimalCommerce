import React from 'react'
import { useNavigate } from 'react-router-dom';
function AuthButton({type}) {
    const navigate = useNavigate()
    const config = {
        login:{
            label:"Login",
            className:"btn btn-secondary",
            route:'/login'
        },
        signup:{
            label:'Sign Up',
            className:"btn btn-primary",
            route:'/signup'
        }
    }

    const button = config[type]

    if(!button) return null;

    const navigateTo = (route) => {
        navigate(route)
    }

  return (
    <button 
     onClick={ () => navigateTo(button.route)} 
     className={button.className} 
    >
     {button.label}
    </button>
  )
}

export default AuthButton