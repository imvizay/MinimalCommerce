import React from 'react'

function AuthButton({type}) {

    const config = {
        login:{
            label:"Login",
            className:"btn btn-secondary",
            route:'/login'
        },
        signup:{
            label:'Sign Up',
            className:"btn btn-primary",
            route:'/register'
        }
    }

    const button = config[type]

    if(!button) return null;

  return (
    <button className={button.className} >
        {button.label}
    </button>
  )
}

export default AuthButton