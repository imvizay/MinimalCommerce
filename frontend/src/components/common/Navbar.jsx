import React from "react";
import { Link } from "react-router-dom";
import "@/assets/css/components/navbar.css";

import AuthButton from "../buttons/AuthButton";

// user context
import { useUserContext } from "../../contexts/UserContext";

function Navbar() {

  const { user ,logoutUser } = useUserContext()


  return (
    <header id="header">
      <div className="navContainer">
        
        {/* Logo */}
        <div className="webLogo">MinimalCommerce</div>

        {/* Right Section */}
        <div className="userInfo">
          {!user ? (
            <>
              <AuthButton type='login'/>
              <AuthButton type='signup'/>
            </>
          ) : (
            <>
              <span className="userName">{user.email.split('@')[0].toUpperCase()}</span>
              <div className="userAvatar">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <button onClick={logoutUser} className="btn btn-secondary">
                Logout
              </button>
            </>
          )}
        </div>

      </div>
    </header>
  );
}

export default Navbar;