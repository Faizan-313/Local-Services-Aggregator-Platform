"use client"
import React from "react"

import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { useServices } from "../contexts/ServiceContext"
import { Search, Filter, Star, MapPin, DollarSign } from "lucide-react"

function Services() {
  const { services, categories, searchServices } = useServices()
  const [searchParams, setSearchParams] = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    location: searchParams.get("location") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    minRating: searchParams.get("minRating") || "",
  })
  const [filteredServices, setFilteredServices] = useState(services)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const results = searchServices(searchQuery, filters)
    setFilteredServices(results)
  }, [searchQuery, filters, services])

  const handleSearch = (e) => {
    e.preventDefault()
    updateSearchParams()
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const updateSearchParams = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.set("q", searchQuery)
    if (filters.category) params.set("category", filters.category)
    if (filters.location) params.set("location", filters.location)
    if (filters.minPrice) params.set("minPrice", filters.minPrice)
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice)
    if (filters.minRating) params.set("minRating", filters.minRating)
    setSearchParams(params)
  }

  const clearFilters = () => {
    setFilters({
      category: "",
      location: "",
      minPrice: "",
      maxPrice: "",
      minRating: "",
    })
    setSearchQuery("")
    setSearchParams({})
  }

  return (
    <div className="services-page">
      <div className="services-header">
        <h1>Find Services</h1>
        <p>Discover local service providers in your area</p>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search for services, providers, or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <button type="submit" className="search-button">
            Search
          </button>
          <button type="button" onClick={() => setShowFilters(!showFilters)} className="filter-toggle">
            <Filter className="icon" />
            Filters
          </button>
        </form>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="filters-section">
          <div className="filters-grid">
            <div className="filter-group">
              <label>Category</label>
              <select value={filters.category} onChange={(e) => handleFilterChange("category", e.target.value)}>
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Location</label>
              <input
                type="text"
                placeholder="Enter city or area"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Min Price</label>
              <input
                type="number"
                placeholder="$0"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Max Price</label>
              <input
                type="number"
                placeholder="$1000"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Min Rating</label>
              <select value={filters.minRating} onChange={(e) => handleFilterChange("minRating", e.target.value)}>
                <option value="">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>
          </div>

          <div className="filter-actions">
            <button onClick={updateSearchParams} className="apply-filters-btn">
              Apply Filters
            </button>
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="services-results">
        <div className="results-header">
          <h2>
            {filteredServices.length} Service{filteredServices.length !== 1 ? "s" : ""} Found
          </h2>
        </div>

        <div className="services-grid">
          {filteredServices.map((service) => (
            <div key={service.id} className="service-card">
              <img src={service.image || "/placeholder.svg"} alt={service.title} />
              <div className="service-info">
                <div className="service-category">{service.category}</div>
                <h3>{service.title}</h3>
                <p className="service-provider">{service.providerName}</p>
                <p className="service-description">{service.description}</p>

                <div className="service-meta">
                  <div className="rating">
                    <Star className="star-icon filled" />
                    <span>{service.rating}</span>
                    <span className="review-count">({service.reviews.length})</span>
                  </div>
                  <div className="location">
                    <MapPin className="icon" />
                    <span>{service.location}</span>
                  </div>
                </div>

                <div className="service-footer">
                  <div className="service-price">
                    <DollarSign className="icon" />${service.price}/hour
                  </div>
                  <Link to={`/service/${service.id}`} className="view-service-btn">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="no-results">
            <h3>No services found</h3>
            <p>Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Services
