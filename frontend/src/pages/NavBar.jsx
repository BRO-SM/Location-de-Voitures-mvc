import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function NavBar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // التحقق من وجود التوكن عند تحميل الصفحة
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // true إذا كان موجودًا
  }, []);

  // تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login"); // توجيه إلى صفحة الدخول
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <NavLink className="navbar-brand text-danger" to="/">
            Location Auto
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link text-primary" to="/cars">
                  Véhicules
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link text-primary" to="/clients">
                  Clients
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link text-primary" to="/reservations">
                  Réservations
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link text-primary" to="/contact">
                  Contact
                </NavLink>
              </li>
            </ul>
          </div>

          {isAuthenticated ? (
            <button
              className="btn btn-outline-danger"
              onClick={handleLogout}
            >
              Se déconnecter
            </button>
          ) : (
            <NavLink className="btn btn-outline-primary" to="/login">
              Se connecter
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}
