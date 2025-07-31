"use client"

import { useAuth } from "../contexts/AuthContext"
import { useBookings } from "../contexts/BookingContext"
import { useServices } from "../contexts/ServiceContext"
import { Link } from "react-router-dom"

function CustomerDashboard() {
  const { user } = useAuth()
  const { bookings } = useBookings()
  const { services } = useServices()

  const customerBookings = bookings.filter(b => b.userId === user?.id)

  const bookedServices = customerBookings.map(booking => {
    const service = services.find(s => s.id === booking.serviceId)
    return {
      ...booking,
      service,
    }
  })

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user?.name} 👋</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-purple-100 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold">Total Bookings</h2>
          <p className="text-2xl">{bookedServices.length}</p>
        </div>
        <div className="bg-pink-100 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold">Upcoming Services</h2>
          <p className="text-2xl">
            {
              bookedServices.filter(b =>
                new Date(b.date) >= new Date()
              ).length
            }
          </p>
        </div>
        <div className="bg-orange-100 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold">Completed</h2>
          <p className="text-2xl">
            {
              bookedServices.filter(b =>
                new Date(b.date) < new Date()
              ).length
            }
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Your Bookings</h2>

      {bookedServices.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">You haven't booked any services yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bookedServices.map(({ id, date, service }) => (
            <div
              key={id}
              className="bg-white rounded-xl shadow p-4 border hover:shadow-lg transition"
            >
              <img
                src={service?.image || "/placeholder.svg"}
                alt={service?.title}
                className="w-full h-40 object-cover rounded-md mb-3"
              />
              <h3 className="text-xl font-bold">{service?.title}</h3>
              <p className="text-gray-600 text-sm">{service?.description}</p>
              <p className="text-sm mt-2">💰 ₹{service?.price}</p>
              <p className="text-sm">📍 {service?.location}</p>
              <p className="text-sm">⭐ {service?.rating} ({service?.reviews?.length || 0} reviews)</p>
              <p className="text-sm mt-2">📅 Booking Date: {new Date(date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CustomerDashboard