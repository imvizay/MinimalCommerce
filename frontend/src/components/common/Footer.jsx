import React from "react"
import "@/assets/css/components/footer.css"
import { Link } from "react-router-dom"
import { HashLink } from 'react-router-hash-link'

function Footer() {
  return (
    <footer id="footer">

      <div className="footerGlow"></div>

      <div className="footerGrid">

        {/* LEFT */}
        <div className="footerBrand">

          <h2>MinimalCommerce</h2>

          <p>
            Elevating everyday shopping through
            modern aesthetics, premium quality,
            and timeless minimal design.
          </p>

        </div>

        {/* CENTER */}
        <div className="footerLinks">

          <h4>Shortcuts</h4>

          <Link to='/' >Home</Link>
          
          <HashLink  smooth to="/#products">Browse Products</HashLink>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>

        </div>

      </div>

      {/* BOTTOM */}
      <div className="footerBottom">

        <div className="businessContact">

          <span>
            Business Contact :-
          </span>

          <Link>
            +91 7987725298
          </Link>

        </div>

        <div className="businessEmail">

          <span>Email :- </span>

          <Link href="mailto:vizaymeena@gmail.com">
            vizaymeena@gmail.com
          </Link>

        </div>

      </div>

    </footer>
  )
}

export default Footer