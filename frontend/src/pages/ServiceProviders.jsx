import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Search, Filter } from "lucide-react";

export default function ServiceProviderList() {
  const { serviceName } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const backendUrl = import.meta.env.VITE_SERVER_API_URL; // get your backend URL

  const [categoryServices, setCategoryServices] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [filters, setFilters] = useState({
    location: searchParams.get("location") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
  });
  const [showFilters, setShowFilters] = useState(false);

  // 🟢 Fetch providers by category when serviceName changes
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const params = new URLSearchParams();
        if (serviceName) params.append("category", serviceName.toLowerCase());

        const url = `${backendUrl}/listings?${params.toString()}`;
        const res = await fetch(url, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch providers");

        const data = await res.json();
        setCategoryServices(data);
      } catch (error) {
        console.error("Error fetching providers:", error);
      }
    };

    fetchProviders();
  }, [serviceName, backendUrl]);

  // 🟢 Apply local search / price / location filters
  useEffect(() => {
    const filtered = categoryServices.filter((service) => {
      const matchesQuery =
        !searchQuery ||
        service.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLocation =
        !filters.location ||
        service.location?.toLowerCase().includes(filters.location.toLowerCase());

      const matchesMinPrice =
        !filters.minPrice || Number(service.price) >= Number(filters.minPrice);

      const matchesMaxPrice =
        !filters.maxPrice || Number(service.price) <= Number(filters.maxPrice);

      return matchesQuery && matchesLocation && matchesMinPrice && matchesMaxPrice;
    });

    setFilteredProviders(filtered);
  }, [categoryServices, searchQuery, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    updateSearchParams();
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const updateSearchParams = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (filters.location) params.set("location", filters.location);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilters({ location: "", minPrice: "", maxPrice: "" });
    setSearchParams({});
  };

  return (
  <div className="min-h-screen bg-gray-50 py-10 px-4">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 capitalize">
          {serviceName} Providers
        </h1>
        <p className="text-gray-500">Search and filter the best service providers</p>
      </div>

      <form
        onSubmit={handleSearch}
        className="flex flex-wrap items-center justify-center gap-3 mb-8"
      >
        <div className="flex items-center bg-white border rounded-md shadow-sm px-3 py-2 w-full max-w-md">
          <Search className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search providers or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-gray-700 placeholder-gray-400 outline-none"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 transition"
        >
          <Filter className="mr-1" /> Filters
        </button>
      </form>

      {showFilters && (
        <div className="bg-white shadow rounded-lg p-5 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                placeholder="City or area"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Min Price</label>
              <input
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Max Price</label>
              <input
                type="number"
                placeholder="1000"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={updateSearchParams}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProviders.map((provider) => (
          <div
            key={provider.id}
            className="bg-white rounded-lg shadow hover:shadow-md transition p-5 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-1">{provider.title}</h3>
              <p className="text-gray-600 mb-2">{provider.description}</p>
            </div>
            <div className="text-sm text-gray-500 space-y-1 mt-2">
              <p>Location: {provider.location}</p>
              <p>Price: ₹{provider.price}</p>
              <p>Rating: {provider.rating || "N/A"}</p>
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
