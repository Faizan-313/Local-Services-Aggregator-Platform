"use client"
import React, { createContext, useContext, useState, useEffect } from "react"
import { fetchWithAuth } from "../api/api.js"
import toast from "react-hot-toast"

const ServiceContext = createContext()

export function useServices() {
  return useContext(ServiceContext)
}

export function ServiceProvider({ children }) {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const backendUrl = import.meta.env.VITE_SERVER_API_URL

  const refreshServices = async (category = "") => {
    try {
      setLoading(true)
      setError(null)
      let url = `${backendUrl}/listings`
      const params = new URLSearchParams()
      if (category) params.set("category", category.toLowerCase())
      if (params.toString()) url += `?${params}`

      const res = await fetchWithAuth(url, { credentials: "include" })
      if (!res.ok) throw new Error("Failed to fetch services")
      const data = await res.json()
      setServices(data)
    } catch (err) {
      console.error("Fetch services error:", err)
      setError(err.message || "An error occurred while fetching services")
    } finally {
      setLoading(false)
    }
  }

  const addService = async (serviceData) => {
    try {
      const res = await fetchWithAuth(`${backendUrl}/listings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(serviceData),
      })
      if (!res.ok) throw new Error((await res.json()).message || "Failed to add service")
      await refreshServices()
      toast.success("Service added successfully")
      return { success: true }
    } catch (err) {
      console.error("Add service error:", err)
      return { success: false, error: err.message }
    }
  }

  const addReview = async (listingId, rating, comment) => {
    try {
      const res = await fetchWithAuth(`${backendUrl}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ listingId, rating, comment }),
      })
      if (!res.ok) throw new Error((await res.json()).message || "Failed to add review")
      await refreshServices()
      toast.success("Review Added")
      return { success: true }
    } catch (err) {
      console.error("Add review error:", err)
      return { success: false, error: err.message }
    }
  }

  useEffect(() => {
    refreshServices()
  }, [])

  const value = {
    services,
    loading,
    error,
    refreshServices,
    addService,
    addReview,
  }

  return (
    <ServiceContext.Provider value={value}>
      {children}
    </ServiceContext.Provider>
  )
}
