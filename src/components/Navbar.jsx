"use client"

import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useBookings } from "../contexts/BookingContext"
import { Bell, User, LogOut, Home, Search } from "lucide-react"

function Navbar() {
  const { user, logout } = useAuth()
  const { notifications } = useBookings()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const unreadNotifications = notifications.filter((n) => !n.read && n.userId === user?.id).length

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <Home className="nav-icon" />
          LocalServices
        </Link>

        <div className="nav-links">
          <Link to="/services" className="nav-link">
            <Search className="nav-icon" />
            Browse Services
          </Link>

          {user ? (
            <div className="nav-user-section">
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>

              <div className="notification-icon">
                <Bell className="nav-icon" />
                {unreadNotifications > 0 && <span className="notification-badge">{unreadNotifications}</span>}
              </div>

              <div className="user-menu">
                <User className="nav-icon" />
                <span>{user.name}</span>
                <div className="user-dropdown">
                  <Link to="/profile" className="dropdown-item">
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item">
                    <LogOut className="nav-icon" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link nav-button">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
