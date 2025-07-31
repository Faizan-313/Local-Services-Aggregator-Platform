"use client"
import React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { fetchWithAuth } from "../api/api.js"

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

// backend API URL
const API_URL = import.meta.env.VITE_SERVER_API_URL

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for user data in localstorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
        localStorage.setItem("user", JSON.stringify(data.user))
        return { success: true }
      } else {
        const error = await res.json()
        return { success: false, error: error.message || "Login failed" }
      }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "Server error" }
    }
  }

  const register = async (userData) => {
    try {
      const url = userData.role === "provider"
        ? `${API_URL}/auth/register-provider`
        : `${API_URL}/auth/register`

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: "include",
      })
      const data = await res.json()

      if (res.ok) {
        return { success: true }
      } else {
        return { success: false, error: data.error || "Registration failed" }
      }
    } catch (err) {
      return { success: false, error: err }
    }
  }


  const logout = async () => {
    try {
      await fetchWithAuth(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include", // send cookies
      })
    } catch (error) {
      console.error("Logout error:", error)
    }
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
