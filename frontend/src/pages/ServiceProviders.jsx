import React, { useEffect, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { Search, Filter } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

export default function ServiceProviderList() {
  const { serviceName } = useParams()
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const backendUrl = import.meta.env.VITE_SERVER_API_URL

  const [categoryServices, setCategoryServices] = useState([])
  const [filteredProviders, setFilteredProviders] = useState([])
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [filters, setFilters] = useState({
    location: searchParams.get("location") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await fetch(`${backendUrl}/listings?category=${serviceName.toLowerCase()}`, {
          credentials: "include",
        })
        if (!res.ok) throw new Error("Failed to fetch providers")
        const data = await res.json()
        setCategoryServices(data)
      } catch (err) {
        console.error("Error fetching providers:", err)
      }
    }

    fetchProviders()
  }, [serviceName, backendUrl])

  useEffect(() => {
    const filtered = categoryServices.filter((service) => {
      const matchesQuery =
        !searchQuery ||
        service.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesLocation =
        !filters.location || service.location?.toLowerCase().includes(filters.location.toLowerCase())

      const matchesMinPrice =
        !filters.minPrice || Number(service.price) >= Number(filters.minPrice)

      const matchesMaxPrice =
        !filters.maxPrice || Number(service.price) <= Number(filters.maxPrice)

      return matchesQuery && matchesLocation && matchesMinPrice && matchesMaxPrice
    })

    setFilteredProviders(filtered)
  }, [categoryServices, searchQuery, filters])

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
    if (filters.location) params.set("location", filters.location)
    if (filters.minPrice) params.set("minPrice", filters.minPrice)
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice)
    setSearchParams(params)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setFilters({ location: "", minPrice: "", maxPrice: "" })
    setSearchParams({})
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 capitalize">
            {serviceName} Providers
          </h1>
          <p className="text-gray-500">Search and filter the best service providers</p>
        </div>

        {/* Search and Filter */}
        <form onSubmit={handleSearch} className="flex flex-wrap gap-3 justify-center mb-8">
          <div className="flex items-center bg-white border rounded-md px-3 py-2 w-full max-w-md">
            <Search className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search providers or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full outline-none"
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Search
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center border px-4 py-2 rounded"
          >
            <Filter className="mr-1" /> Filters
          </button>
        </form>

        {showFilters && (
          <div className="bg-white rounded-lg shadow p-5 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Location"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                className="border rounded px-3 py-2 w-full"
              />
              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                className="border rounded px-3 py-2 w-full"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div className="mt-4 flex gap-3">
              <button onClick={updateSearchParams} className="bg-green-600 text-white px-4 py-2 rounded">
                Apply Filters
              </button>
              <button onClick={clearFilters} className="bg-gray-300 px-4 py-2 rounded">
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((provider) => (
            <div key={provider.id} className="bg-white rounded-lg shadow p-4">
              <h3 className="text-xl font-semibold mb-1">{provider.title}</h3>
              <p className="text-gray-700 mb-1">{provider.description}</p>
              <p className="text-sm text-gray-600">Location: {provider.location}</p>
              <p className="text-sm text-gray-600">Price: ₹{provider.price}</p>
              <div className="mt-4 flex gap-2">
                {user && (
                  <>
                    <a
                      href={`/book/${provider.id}?customerId=${user.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Book Now
                    </a>
                    <a
                      href={`/service/${provider.id}`}
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                    >
                      View Details
                    </a>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredProviders.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            <h3 className="text-lg font-semibold">No providers found</h3>
            <p>Try adjusting your filters or search</p>
          </div>
        )}
      </div>
    </div>
  )
}
