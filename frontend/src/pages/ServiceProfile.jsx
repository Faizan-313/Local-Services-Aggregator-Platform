// src/pages/ServiceProfile.jsx
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useServices } from "../contexts/ServiceContext"
import { Star } from "lucide-react"

function ServiceProfile() {
  const { id } = useParams()
  const { services } = useServices()
  const [provider, setProvider] = useState(null)

  useEffect(() => {
    const found = services.find((s) => s.id === Number(id))
    setProvider(found)
  }, [id, services])

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`inline w-4 h-4 ${i < rating ? "text-yellow-500" : "text-gray-300"}`}
        fill={i < rating ? "#facc15" : "none"}
      />
    ))
  }

  if (!provider) return <div className="text-center p-6">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow mt-6">
      <h1 className="text-3xl font-bold mb-2">{provider.title}</h1>
      <p className="text-gray-700 mb-2">{provider.description}</p>
      <p><strong>Location:</strong> {provider.city}</p>
      <p><strong>Price:</strong> ₹{provider.price}</p>
      
      <div className="mt-2 flex items-center gap-2">
        {renderStars(Math.round(provider.average_rating || 0))}
        <span className="ml-2 text-sm text-gray-600">
          {provider.average_rating ? provider.average_rating.toFixed(1) : "No rating yet"}
        </span>
      </div>

      <p className="mt-2"><strong>Category:</strong> {provider.service_name}</p>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Reviews</h3>
        {Array.isArray(provider.reviews) && provider.reviews.length > 0 ? (
          <ul className="space-y-2">
            {provider.reviews.map((review, idx) => (
              <li key={idx} className="border p-2 rounded">
                <div className="flex items-center gap-2">
                  {renderStars(review.rating)}
                  <span className="text-sm text-gray-600">{review.rating}/5</span>
                </div>
                <p className="text-gray-700 mt-1">{review.comment}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>
    </div>
  )
}

export default ServiceProfile
