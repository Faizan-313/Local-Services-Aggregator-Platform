"use client"
import React from "react"
import { useServices } from "../contexts/ServiceContext"
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"

function ProviderDashboard() {
  const { services } = useServices()
  const { user } = useAuth()

  const providerServices = services.filter(service => service.provider_id === user?.id)

  const totalReviews = providerServices.reduce(
    (sum, s) => sum + (Array.isArray(s.reviews) ? s.reviews.length : 0),
    0
  )

  const avgRating = providerServices.length
    ? (
        providerServices.reduce(
          (sum, s) => sum + (typeof s.rating === "number" ? s.rating : 0),
          0
        ) / providerServices.length
      ).toFixed(1)
    : "0.0"

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user?.name} 👋</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold">Your Services</h2>
          <p className="text-2xl">{providerServices.length}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold">Total Reviews</h2>
          <p className="text-2xl">{totalReviews}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold">Avg. Rating</h2>
          <p className="text-2xl">{avgRating}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Your Services</h2>
        <Link
          to="/add-service"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Service
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {providerServices.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-xl shadow p-4 border hover:shadow-lg transition"
          >
            <h3 className="text-xl font-bold">{service.title}</h3>
            <p className="text-gray-600 text-sm">{service.description}</p>
            <p className="text-sm mt-2">💰 ₹{service.price}</p>
            <p className="text-sm">📍 {service.location}</p>
            <p className="text-sm">
              ⭐ {typeof service.rating === "number" ? service.rating.toFixed(1) : "0.0"} (
              {Array.isArray(service.reviews) ? service.reviews.length : 0} reviews)
            </p>
          </div>
        ))}
      </div>

      {providerServices.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No services added yet.</p>
      )}
    </div>
  )
}

export default ProviderDashboard
