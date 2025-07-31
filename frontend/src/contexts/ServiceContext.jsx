"use client"
import React, { createContext, useContext, useState, useEffect } from "react"

const ServiceContext = createContext()

export function useServices() {
  return useContext(ServiceContext)
}

export function ServiceProvider({ children }) {
  const [services, setServices] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const backendUrl = import.meta.env.VITE_SERVER_API_URL

  useEffect(() => {
    const fetchServices = async () => {
      try {
        // console.log(`${backendUrl}/listings`)
        const res = await fetch(`${backendUrl}/listings`, {
          method: "GET",
          credentials: "include"
        })
        if (!res.ok) throw new Error("Failed to fetch services")
        const data = await res.json()
        // console.log("Fetched services:", data)
        setServices(data)

        if (Array.isArray(data)) {
          const cats = [...new Set(data.map(item => item.service_name))]
          setCategories(cats)
        }
      } catch (error) {
        console.error("Fetch services error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [backendUrl])

  const addService = async (serviceData) => {
    try {
      const res = await fetch(`${backendUrl}/listings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(serviceData)
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Failed to add service")
      }
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
        body: JSON.stringify({ listingId, rating, comment })
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Failed to add review")
      }
      await refreshServices()
      return { success: true }
    } catch (error) {
      console.error("Add review error:", error)
      return { success: false, error: error.message }
    }
  }

  const refreshServices = async () => {
    try {
      const res = await fetch(`${backendUrl}/listings`, {
        method: "GET",
        credentials: "include"
      })
      if (!res.ok) throw new Error("Failed to refresh services")
      const data = await res.json()
      setServices(data)
    } catch (error) {
      console.error("Refresh services error:", error)
    }
  }

  const searchServices = (query, filters = {}) => {
    return services.filter(service => {
      const matchesQuery =
        !query ||
        service.title.toLowerCase().includes(query.toLowerCase()) ||
        service.service_name.toLowerCase().includes(query.toLowerCase()) ||
        service.city.toLowerCase().includes(query.toLowerCase())

      const matchesCategory = !filters.category || service.service_name === filters.category
      const matchesCity = !filters.city || service.city.toLowerCase().includes(filters.city.toLowerCase())
      const matchesPrice =
        (!filters.minPrice || service.price >= filters.minPrice) &&
        (!filters.maxPrice || service.price <= filters.maxPrice)
      const matchesRating = !filters.minRating || service.average_rating >= filters.minRating

      return matchesQuery && matchesCategory && matchesCity && matchesPrice && matchesRating
    })
  }

  const value = {
    services,
    categories,
    loading,
    addService,
    addReview,
    searchServices,
    refreshServices
  }

  return (
    <ServiceContext.Provider value={value}>
      {children}
    </ServiceContext.Provider>
  )
}
