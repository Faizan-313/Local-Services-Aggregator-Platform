"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { ServiceProvider } from "./contexts/ServiceContext"
import { BookingProvider } from "./contexts/BookingContext"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
// import Dashboard from "./pages/Dashboard"
// import Services from "./pages/Services"
// import ServiceDetail from "./pages/ServiceDetail"
// import BookingPage from "./pages/BookingPage"
// import Profile from "./pages/Profile"
import "./App.css"

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
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
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  {/* <Route path="/services" element={<Services />} /> */}
                  {/* <Route path="/service/:id" element={<ServiceDetail />} /> */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/book/:serviceId"
                    element={
                      <ProtectedRoute>
                        {/* <BookingPage />/ */}
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
              </main>
            </div>
          </Router>
        </BookingProvider>
      </ServiceProvider>
    </AuthProvider>
  )
}

export default App
