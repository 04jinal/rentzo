import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    try {
      setUser(savedUser ? JSON.parse(savedUser) : null);
    } catch {
      setUser(null);
    }
  }, [location.key]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    navigate("/");
  };
  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to="/">
          <img src={logo} alt="Rentzo" />
        </Link>
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/rentals">Browse Rentals</Link>
        <Link to="/how-it-works">How It Works</Link>
        <Link to="/list-item">List Your Item</Link>
        <Link to="/about">About</Link>
      </div>

      <div className="nav-buttons">
        {user ? (
          <>
            <Link to="/my-bookings" className="my-bookings-link">
              My Bookings
            </Link>

            <Link to="/owner-dashboard" className="owner-dashboard-link">
              Owner Dashboard
            </Link>
            
            <span className="user-name">
              Hi, {user.name}
            </span>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="login-btn">
              Login
            </Link>

            <Link to="/register" className="signup-btn">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;