"use client"
import React, { useEffect, useState } from "react"
import { useServices } from "../contexts/ServiceContext"
import { useAuth } from "../contexts/AuthContext"
import { useBookings } from "../contexts/BookingContext"
import { Link } from "react-router-dom"
import { fetchWithAuth } from "../api/api.js"

function ProviderDashboard() {
  const { services } = useServices()
  const { user } = useAuth()
  const { updateBookingStatus } = useBookings()

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [updatingBookingId, setUpdatingBookingId] = useState(null)

  // ✅ New state to store fresh total reviews and avg rating from backend
  const [totalReviews, setTotalReviews] = useState(0)
  const [avgRating, setAvgRating] = useState("0.0")

  // Services created by this provider
  const providerServices = services.filter(
    (service) => service.provider_id === user?.id
  )

  useEffect(() => {
    const fetchReviewsStats = async () => {
      if (!user?.id) return
      try {
        // console.log("Fetching reviews stats for provider...")
        const res = await fetchWithAuth(
          `${import.meta.env.VITE_SERVER_API_URL}/provider`,
          { credentials: "include" }
        )
        // console.log(`${import.meta.env.VITE_SERVER_API_URL}/reviews/provider`,)
        if (!res.ok) throw new Error("Failed to fetch reviews stats")
        const data = await res.json()
        // console.log("Fetched reviews data:", data)
        setTotalReviews(data.totalReviews || 0)
        setAvgRating(
          data.avgRating !== null && !isNaN(data.avgRating)
            ? Number(data.avgRating).toFixed(1)
            : "0.0"
        )

      } catch (err) {
        console.error("Error fetching reviews stats:", err)
      }
    }

    fetchReviewsStats()
  }, [user,user?.id])


  // Fetch provider bookings
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.id) return
      try {
        setLoading(true)
        const res = await fetchWithAuth(
          `${import.meta.env.VITE_SERVER_API_URL}/bookings/provider`,
          { credentials: "include" }
        )
        if (!res.ok) throw new Error("Failed to fetch bookings")
        const data = await res.json()
        setBookings(data)
      } catch (err) {
        console.error("Error fetching provider bookings:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [user?.id])

  const totalBookings = bookings.length
  const pendingBookings = bookings.filter((b) => b.status === "pending").length

  // Accept/reject booking
  const handleUpdateStatus = async (bookingId, newStatus) => {
    setUpdatingBookingId(bookingId)
    const result = await updateBookingStatus(bookingId, newStatus)
    if (result.success) {
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      )
    } else {
      console.error("Failed to update booking status:", result.error)
    }
    setUpdatingBookingId(null)
  }


  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user?.name} 👋</h1>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
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
        <div className="bg-purple-100 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold">Bookings</h2>
          <p className="text-lg">Total: {totalBookings}</p>
          <p className="text-sm">Pending: {pendingBookings}</p>
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
              ⭐{" "}
              {typeof service.average_rating === "number"
                ? service.average_rating.toFixed(1)
                : "0.0"}{" "}
              ({Array.isArray(service.reviews) ? service.reviews.length : 0} reviews)
            </p>
            {/* <button 
              onClick={()=> handleDelete(service.id)} 
              className="border-2 ml-auto rounded-xl p-[5px] mt-1 text-white bg-red-400 cursor-pointer hover:bg-red-500"
            >
              Delete
            </button> */}
          </div>
        ))}
      </div>

      {providerServices.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No services added yet.</p>
      )}

      {/* Show recent bookings */}
      {bookings.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Recent Bookings</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-xl shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Customer</th>
                  <th className="px-4 py-2 text-left">Listing</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-t">
                    <td className="px-4 py-2">{b.customer_name}</td>
                    <td className="px-4 py-2">{b.title}</td>
                    <td className="px-4 py-2">
                      {new Date(b.booking_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 capitalize">{b.status}</td>
                    <td className="px-4 py-2">
                      {b.status === "pending" && (
                        updatingBookingId === b.id ? (
                          <span className="text-gray-500 text-xs">Updating...</span>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateStatus(b.id, "accepted")}
                              className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(b.id, "rejected")}
                              className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                            >
                              Reject
                            </button>
                          </div>
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

export default ProviderDashboard
