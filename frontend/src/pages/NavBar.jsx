import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth"; 

export default function NavBar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
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
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link" to="/cars">Véhicules</NavLink>
              </li>

              {isAuthenticated && user?.role === "admin" && (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/clients">Clients</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/reservations">Réservations</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/dashboard">Dashboard</NavLink>
                  </li>
                </>
              )}

              {isAuthenticated && user?.role === "client" && (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/my-bookings">Mes réservations</NavLink>
                  </li>
                </>
              )}

              <li className="nav-item">
                <NavLink className="nav-link" to="/contact">Contact</NavLink>
              </li>
            </ul>
          </div>

          <div className="d-flex align-items-center gap-2">
            {isAuthenticated ? (
              <>
                <span className="text-secondary small">
                  👋 {user.first_name} ({user.role})
                </span>
                <button className="btn btn-outline-danger" onClick={handleLogout}>
                  Se déconnecter
                </button>
                
              </>
            ) : (
              <NavLink className="btn btn-outline-primary" to="/login">
                Se connecter
              </NavLink>
            )}
          </div>
          
        </div>
      </nav>
    </header>
  );
}
