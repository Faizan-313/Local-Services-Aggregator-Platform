"use client"
import React, { createContext, useContext, useState } from "react"

const ServiceContext = createContext()

export function useServices() {
  return useContext(ServiceContext)
}

export function ServiceProvider({ children }) {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  const backendUrl = import.meta.env.VITE_SERVER_API_URL 

  const refreshServices = async (category = "") => {
    try {
      setLoading(true)
      let url = `${backendUrl}/listings`
      const params = new URLSearchParams()
      if (category) params.set("category", category.toLowerCase())
      if (params.toString()) url += `?${params}`

      const res = await fetch(url, { credentials: "include" })
      if (!res.ok) throw new Error("Failed to fetch services")
      const data = await res.json()
      setServices(data)
    } catch (error) {
      console.error("Fetch services error:", error)
    } finally {
      setLoading(false)
    }
  }

  const addService = async (serviceData) => {
    try {
      const res = await fetch(`${backendUrl}/listings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(serviceData),
      })
      if (!res.ok) throw new Error((await res.json()).message || "Failed to add service")
      await refreshServices()
      return { success: true }
    } catch (error) {
      console.error("Add service error:", error)
      return { success: false, error: error.message }
    }
  }

  const addReview = async (listingId, rating, comment) => {
    try {
      const res = await fetch(`${backendUrl}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ listingId, rating, comment }),
      })
      if (!res.ok) throw new Error((await res.json()).message || "Failed to add review")
      await refreshServices()
      return { success: true }
    } catch (error) {
      console.error("Add review error:", error)
      return { success: false, error: error.message }
    }
  }

  const value = {
    services,
    loading,
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
