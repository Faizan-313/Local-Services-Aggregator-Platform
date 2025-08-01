"use client"
import React, { useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useBookings } from "../contexts/BookingContext"

function CustomerDashboard() {
  const { user } = useAuth()
  const { bookings, fetchMyBookings } = useBookings()


  useEffect(() => {
    fetchMyBookings()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user?.name} 👋</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-purple-100 p-4 rounded-xl shadow">
          
          <h2 className="text-xl font-semibold">Total Bookings</h2>
          <p className="text-2xl">{bookings.length}</p>
        </div>
        <div className="bg-pink-100 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold">Upcoming Services</h2>
          <p className="text-2xl">
            {bookings.filter(
              b => new Date(b.booking_date) >= new Date() && b.status !== "rejected"
            ).length}
          </p>
        </div>

        <div className="bg-orange-100 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold">Completed</h2>
          <p className="text-2xl">
            {bookings.filter(b => new Date(b.booking_date) < new Date()).length}
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Your Bookings</h2>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">You haven't booked any services yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bookings.map(b => (
            <div key={b.id} className="bg-white rounded-xl shadow p-4 border hover:shadow-lg transition">
              <h3 className="text-xl font-bold">{b.title}</h3>
              <p className="text-gray-600 text-sm">City: {b.city}</p>
              <p className="text-gray-600 text-sm">Price: ₹{b.price}</p>
              <p
                className={`text-sm font-medium ${b.status === "pending"
                  ? "text-yellow-600"
                  : b.status === "accepted"
                    ? "text-green-600"
                    : b.status === "rejected"
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
              >
                {b.status}
              </p>
              <p className="text-sm mt-2">📅 Booking Date: {new Date(b.booking_date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CustomerDashboard
