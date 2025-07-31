"use client"

import { createContext, useContext, useState } from "react"

const ServiceContext = createContext()

export function useServices() {
  return useContext(ServiceContext)
}

export function ServiceProvider({ children }) {
  const [services, setServices] = useState([
    {
      id: 1,
      providerId: 1,
      providerName: "John Provider",
      title: "Professional Electrical Services",
      category: "Electrician",
      description: "Licensed electrician with 10+ years experience",
      price: 75,
      location: "New York, NY",
      rating: 4.8,
      reviews: [{ id: 1, userId: 2, userName: "Jane Customer", rating: 5, comment: "Excellent work!" }],
      availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      providerId: 1,
      providerName: "Sarah Wilson",
      title: "Math & Science Tutoring",
      category: "Tutor",
      description: "Experienced tutor for high school and college students",
      price: 50,
      location: "Los Angeles, CA",
      rating: 4.9,
      reviews: [],
      availability: ["Monday", "Wednesday", "Friday", "Saturday"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      providerId: 1,
      providerName: "Mike Johnson",
      title: "Residential Plumbing Services",
      category: "Plumber",
      description: "Fast and reliable plumbing repairs and installations",
      price: 85,
      location: "Chicago, IL",
      rating: 4.6,
      reviews: [],
      availability: ["Tuesday", "Thursday", "Friday", "Saturday", "Sunday"],
      image: "/placeholder.svg?height=200&width=300",
    },
  ])

  const [categories] = useState([
    "Electrician",
    "Plumber",
    "Tutor",
    "Home Cleaning",
    "Fitness Trainer",
    "Handyman",
    "Gardener",
    "Painter",
  ])

  const addService = (serviceData) => {
    const newService = {
      id: Date.now(),
      ...serviceData,
      rating: 0,
      reviews: [],
    }
    setServices((prev) => [...prev, newService])
  }

  const addReview = (serviceId, review) => {
    setServices((prev) =>
      prev.map((service) => {
        if (service.id === serviceId) {
          const newReviews = [...service.reviews, { ...review, id: Date.now() }]
          const newRating = newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length
          return {
            ...service,
            reviews: newReviews,
            rating: Math.round(newRating * 10) / 10,
          }
        }
        return service
      }),
    )
  }

  const searchServices = (query, filters = {}) => {
    return services.filter((service) => {
      const matchesQuery =
        !query ||
        service.title.toLowerCase().includes(query.toLowerCase()) ||
        service.category.toLowerCase().includes(query.toLowerCase()) ||
        service.location.toLowerCase().includes(query.toLowerCase())

      const matchesCategory = !filters.category || service.category === filters.category
      const matchesLocation =
        !filters.location || service.location.toLowerCase().includes(filters.location.toLowerCase())
      const matchesPrice =
        (!filters.minPrice || service.price >= filters.minPrice) &&
        (!filters.maxPrice || service.price <= filters.maxPrice)
      const matchesRating = !filters.minRating || service.rating >= filters.minRating

      return matchesQuery && matchesCategory && matchesLocation && matchesPrice && matchesRating
    })
  }

  const value = {
    services,
    categories,
    addService,
    addReview,
    searchServices,
  }

  return <ServiceContext.Provider value={value}>{children}</ServiceContext.Provider>
}
