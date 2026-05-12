import "@/assets/css/components/navbar.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";
// user context
import { useCart } from "@contexts/CartContext";
import { useUserContext } from "../../contexts/UserContext";

// icons
import {Bell,ShoppingBag, User2} from 'lucide-react'


function Navbar() {
  const { user, logoutUser } = useUserContext();
  const {totalCartItems} = useCart()

  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <header id="header">
      <div className="navContainer">

        {/* LEFT - Logo */}
        <div className="navLeft">
          <Link to="/" className="webLogo">MinimalCommerce</Link>
        </div>

        {/* CENTER - Search
        <div className="navCenter">
          <input type="text" placeholder="Search products..." />
        </div> */}

        {/* RIGHT - Actions */}
        <div className="navRight">

          {/* Cart */}
          <Link to="/cart" className="navIcon">
            <ShoppingBag />
            <span className="badge">{totalCartItems}</span>
          </Link>

          {/* Notifications */}
          <div className="navIcon">
            <Bell/>
            <span className="badge">{0}</span>
          </div>

          {/* USER */}
          {!user ? (
            <div className="authBtns">
              <Link className="link login" to="/login"><User2 /></Link>
            </div>
          ) : (
            <div className="userSection">
              <div
                className="userAvatar"
                onClick={() => setOpenDropdown(prev => !prev)}
              >
                {user.email?.charAt(0).toUpperCase()}
              </div>

              {/* DROPDOWN */}
              {openDropdown && (
                <div className="dropdown">
                  <p className="username">
                    {user.email.split("@")[0]}
                  </p>

                  <Link to={user.is_superuser ? '/admindashboard' : '/userdashboard'}>Dashboard</Link>
                  <Link to="/my-orders">Orders</Link>
                  <Link to="/cart">Cart </Link>
                  <Link to="/notifications">Notifications</Link>

                  <button onClick={logoutUser}>Logout</button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </header>
  )
}

export default Navbar

