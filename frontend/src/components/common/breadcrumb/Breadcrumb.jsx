import { Link, useLocation } from "react-router-dom"
import { Home, ChevronRight } from "lucide-react"

function Breadcrumb() {
  const location = useLocation()

  const pathnames = location.pathname.split("/").filter(Boolean)

  const formatName = (name) =>
    name
      .replace("-", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <div className="breadcrumb-container">

      {/* Home */}
      <Link to="/" className="breadcrumb-link home-link">
        <Home size={16} />
        <span>Home</span>
      </Link>

      {pathnames.map((name, index) => {
        const routeTo = "/" + pathnames.slice(0, index + 1).join("/")
        const isLast = index === pathnames.length - 1

        // no route exists
        const isInvalidRoute = name === "my-order-items" && !isLast

        return (
          <div key={index} className="breadcrumb-item">
            <ChevronRight size={16} />
        
            {isLast || isInvalidRoute ? (
              <span className="breadcrumb-active">
                {formatName(name)}
              </span>
            ) : (
              <Link to={routeTo} className="breadcrumb-link">
                {formatName(name)}
              </Link>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default Breadcrumb