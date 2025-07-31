"use client";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useBookings } from "../contexts/BookingContext";
import { Bell, User, LogOut, Home, Search } from "lucide-react";

function Navbar() {
  const { user, logout } = useAuth();
  const { notifications } = useBookings();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const unreadNotifications = notifications.filter(
    (n) => !n.read && n.userId === user?.id
  ).length;

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-semibold text-blue-600 hover:text-blue-800">
          <Home className="w-5 h-5" />
          LocalServices
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/services"
            className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition"
          >
            <Search className="w-5 h-5" />
            Browse Services
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Dashboard
              </Link>

              <div className="relative">
                <Bell className="w-5 h-5 text-gray-700 hover:text-blue-600" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                    {unreadNotifications}
                  </span>
                )}
              </div>

              <div className="relative group">
                <div className="flex items-center gap-1 cursor-pointer text-gray-700 group-hover:text-blue-600">
                  <User className="w-5 h-5" />
                  <span>{user.name}</span>
                </div>

                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-1  group-hover:pointer-events-auto z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
