"use client"
import React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { ServiceProvider } from "./contexts/ServiceContext"
import { BookingProvider } from "./contexts/BookingContext"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ProviderDashboard from "./pages/ProviderDashboard"
import CustomerDashboard from "./pages/CustomerDashboard"
import Services from "./pages/Services"
import ServiceDetail from "./pages/ServiceDetail"
import AddService from "./pages/addService"
import ServiceProviders from "./pages/ServiceProviders";
import BookingPage from "./pages/Booking"
import ServiceProfile from "./pages/ServiceProfile"
import './App.css'
import { Toaster } from "react-hot-toast"

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

function AppContent() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/services" element={<Services />} />
      <Route path="/add-service" element={<AddService />} />
      <Route path="/service/:id" element={<ServiceDetail />} />
      <Route path="/services/:serviceName" element={<ServiceProviders />} />
      <Route path="/book/:serviceId" element={<ProtectedRoute> <BookingPage /></ProtectedRoute>} />
      <Route path="/provider/:id" element={<ServiceProfile />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {user?.role === "provider" ? (
              <ProviderDashboard />
            ) : user?.role === "customer" ? (
              <CustomerDashboard />
            ) : (
              <Navigate to="/" />
            )}
          </ProtectedRoute>
        }
      />
      <Route
        path="/book/:serviceId"
        element={
          <ProtectedRoute>
            {/* <BookingPage /> */}
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            {/* <Profile /> */}
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <ServiceProvider>
        <BookingProvider>
          <Router>
            <div className="App">
              <Navbar />
              <main className="main-content">
                <AppContent />
                <Toaster position="top-center" reverseOrder={false} />
              </main>
            </div>
          </Router>
        </BookingProvider>
      </ServiceProvider>
    </AuthProvider>
  )
}

export default App
