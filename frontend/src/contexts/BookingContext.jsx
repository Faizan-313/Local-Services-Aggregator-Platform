"use client"
import React from "react"

import { createContext, useContext, useState } from "react"

const BookingContext = createContext()

export function useBookings() {
  return useContext(BookingContext)
}

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState([])
  const [notifications, setNotifications] = useState([])

  const createBooking = (bookingData) => {
    const newBooking = {
      id: Date.now(),
      ...bookingData,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    setBookings((prev) => [...prev, newBooking])

    // Add notification
    addNotification({
      type: "booking_created",
      message: `Booking request sent for ${bookingData.serviceTitle}`,
      userId: bookingData.customerId,
    })

    return newBooking
  }

  const updateBookingStatus = (bookingId, status) => {
    setBookings((prev) =>
      prev.map((booking) => {
        if (booking.id === bookingId) {
          const updatedBooking = { ...booking, status }

          // Add notification
          addNotification({
            type: "booking_updated",
            message: `Booking ${status} for ${booking.serviceTitle}`,
            userId: booking.customerId,
          })

          return updatedBooking
        }
        return booking
      }),
    )
  }

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      ...notification,
      createdAt: new Date().toISOString(),
      read: false,
    }
    setNotifications((prev) => [...prev, newNotification])
  }

  const markNotificationAsRead = (notificationId) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === notificationId ? { ...notif, read: true } : notif)))
  }

  const value = {
    bookings,
    notifications,
    createBooking,
    updateBookingStatus,
    addNotification,
    markNotificationAsRead,
  }

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}
