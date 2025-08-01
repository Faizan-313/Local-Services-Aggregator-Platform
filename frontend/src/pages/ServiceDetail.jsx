"use client"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Star, MapPin, DollarSign } from "lucide-react"
import { useServices } from "../contexts/ServiceContext"
import { useAuth } from "../contexts/AuthContext"
import { fetchWithAuth } from "../api/api"

function ServiceDetails() {
    const { id } = useParams()
    const { addReview } = useServices()
    const { user } = useAuth()

    const [service, setService] = useState(null)
    const [reviews, setReviews] = useState([])
    const [newComment, setNewComment] = useState("")
    const [newRating, setNewRating] = useState(0)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)

    const backendUrl = import.meta.env.VITE_SERVER_API_URL

    useEffect(() => {
        const fetchService = async () => {
            try {
                const res = await fetchWithAuth(`${backendUrl}/listings/${id}`, {
                    credentials: "include",
                })
                const data = await res.json()
                setService(data)
            } catch (err) {
                console.error("Failed to fetch service", err)
            }
        }

        const fetchReviews = async () => {
            try {
                const res = await fetchWithAuth(`${backendUrl}/reviews/${id}`, {
                    credentials: "include",
                })
                const data = await res.json()
                setReviews(data)
            } catch (err) {
                console.error("Failed to fetch reviews", err)
            } finally {
                setLoading(false)
            }
        }

        fetchService()
        fetchReviews()
    }, [id])

    const handleSubmitReview = async (e) => {
        e.preventDefault()
        if (!newRating || !newComment) return

        const result = await addReview(Number(id), newRating, newComment)
        if (result.success) {
            const res = await fetch(`${backendUrl}/reviews/${id}`, {
                credentials: "include",
            })
            const data = await res.json()
            setReviews(data)
            setNewRating(0)
            setNewComment("")
            setError("")
        } else {
            setError(result.error)
        }
    }

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={`inline w-4 h-4 ${i < rating ? "text-yellow-500" : "text-gray-300"
                    }`}
                fill={i < rating ? "#facc15" : "none"}
            />
        ))
    }

    const renderRatingSelector = () => {
        return (
            <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((value) => (
                    <Star
                        key={value}
                        className={`w-6 h-6 cursor-pointer ${value <= newRating ? "text-yellow-500" : "text-gray-400"
                            }`}
                        fill={value <= newRating ? "#facc15" : "none"}
                        onClick={() => setNewRating(value)}
                    />
                ))}
            </div>
        )
    }
    


    if (!service) return <div className="p-6 text-center">Loading service details...</div>

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg mt-6">
            <h1 className="text-3xl font-bold mb-4">{service.title}</h1>
            <p className="mb-2 text-gray-700">{service.description}</p>
            <div className="mb-2 flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                {service.city}
            </div>

            <hr className="my-6" />

            <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
            {reviews.length === 0 ? (
                <p className="text-gray-500 mb-4">No reviews yet.</p>
            ) : (
                <div className="space-y-4 mb-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="border p-3 rounded">
                            <div className="font-semibold text-gray-700 mb-1">{review.customer_name}</div>
                            <div className="flex items-center gap-2 mb-1">
                                {renderStars(review.rating)}
                                <span className="text-sm text-gray-500">
                                    {new Date(review.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm">{review.comment}</p>
                        </div>
                    ))}
                </div>
            )}

            {user && user.role === "customer" && (
                <form onSubmit={handleSubmitReview} className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Write a Review</h3>
                    {renderRatingSelector()}
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows="3"
                        className="w-full border px-3 py-2 rounded mb-2"
                        placeholder="Write your comment..."
                    ></textarea>
                    {error && <p className="text-red-500 mb-2">{error}</p>}
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Submit Review
                    </button>
                </form>
            )}
        </div>
    )
}

export default ServiceDetails
