"use client"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Star, MapPin, DollarSign } from "lucide-react"
import { useServices } from "../contexts/ServiceContext"

function ServiceDetails() {
    const { id } = useParams()
    const { services } = useServices()
    const [service, setService] = useState(null)

    useEffect(() => {
        const found = services.find((s) => s.id === Number(id))
        setService(found)
    }, [id, services])

    if (!service) return <div>Loading service details...</div>

    return (
        <div className="service-details-page">
        <h1>{service.title}</h1>
        <img src={service.image || "/placeholder.svg"} alt={service.title} />

        <p>{service.description}</p>

        <div className="service-meta">
            <div className="category">Category: {service.service_name}</div>
            <div className="location">
            <MapPin className="icon" /> {service.city}
            </div>
            <div className="rating">
            <Star className="icon" />{" "}
            {typeof service.average_rating === "number" ? service.average_rating.toFixed(1) : "N/A"}
            </div>
            <div className="price">
            <DollarSign className="icon" /> ${service.price}
            </div>
        </div>
        </div>
    )
}

export default ServiceDetails
