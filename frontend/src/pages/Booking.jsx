// src/pages/BookingPage.jsx
import React, { useState } from "react"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

function BookingPage() {
    const { serviceId } = useParams()
    const { user } = useAuth()
    const [date, setDate] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const navigate = useNavigate()

    const handleBooking = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess("")
        setLoading(true)

        try {
            const res = await fetch(`${import.meta.env.VITE_SERVER_API_URL}/bookings`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    listingId: serviceId,
                    bookingDate: date,
                    customerId: user?.id,
                }),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.message || "Booking failed")

            setSuccess("Booking successful!")
            setTimeout(() => navigate("/dashboard"), 1500)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow mt-10">
            <h2 className="text-xl font-semibold mb-4">Book Service</h2>

            {error && <p className="text-red-500 mb-2">{error}</p>}
            {success && <p className="text-green-600 mb-2">{success}</p>}

            <form onSubmit={handleBooking}>
                <label className="block mb-2 font-medium">Select Booking Date:</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border px-3 py-2 rounded w-full mb-4"
                    required
                    min={new Date().toISOString().split("T")[0]} // today
                    max={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]} // 7 days from now
                />


                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                    disabled={loading}
                >
                    {loading ? "Booking..." : "Confirm Booking"}
                </button>
            </form>
        </div>
    )
}

export default BookingPage
