"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    // Mock authentication - in real app, this would call an API
    const mockUsers = [
      { id: 1, email: "provider@test.com", name: "John Provider", role: "provider" },
      { id: 2, email: "customer@test.com", name: "Jane Customer", role: "customer" },
    ]

    const user = mockUsers.find((u) => u.email === email)
    if (user) {
      setUser(user)
      localStorage.setItem("user", JSON.stringify(user))
      return { success: true }
    }
    return { success: false, error: "Invalid credentials" }
  }

  const register = async (userData) => {
    // Mock registration
    const newUser = {
      id: Date.now(),
      ...userData,
    }
    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
