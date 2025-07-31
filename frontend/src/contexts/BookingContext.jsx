"use client"
import React, { createContext, useContext, useState } from "react"
import { fetchWithAuth } from "../api/api.js";

const BookingContext = createContext()

export function useBookings() {
  return useContext(BookingContext)
}

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState([])
  const backendUrl = import.meta.env.VITE_SERVER_API_URL

  // Fetch bookings for the customer
  const fetchMyBookings = async () => {
    try {
      const res = await fetchWithAuth(`${backendUrl}/bookings/my`, {
        method: "GET",
        credentials: "include",
      })
      if (!res.ok) throw new Error("Failed to fetch bookings")
      const data = await res.json()
      setBookings(data)
    } catch (error) {
      console.error("fetchMyBookings error:", error)
    }
  }

  // Create a booking (customer side)
  const createBooking = async (bookingData) => {
    try {
      const res = await fetchWithAuth(`${backendUrl}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(bookingData),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Failed to create booking")
      }
      await fetchMyBookings()
      return { success: true }
    } catch (error) {
      console.error("createBooking error:", error)
      return { success: false, error: error.message }
    }
  }

  // Update booking status (provider side)
  const updateBookingStatus = async (bookingId, status) => {
    try {
      const res = await fetchWithAuth(`${backendUrl}/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Failed to update booking status")
      }
      return { success: true }
    } catch (error) {
      console.error("updateBookingStatus error:", error)
      return { success: false, error: error.message }
    }
  }

  const value = {
    bookings,
    fetchMyBookings,
    createBooking,
    updateBookingStatus,
  }

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}
