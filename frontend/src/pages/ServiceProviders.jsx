import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useServices } from "../contexts/ServiceContext";
import { Search, Filter } from "lucide-react";

export default function ServiceProviderList() {
  const { serviceName } = useParams();
  const { services, searchServices } = useServices();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [filters, setFilters] = useState({
    location: searchParams.get("location") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
  });

  // useEffect(() => {
  //   setFilters((prev) => ({ ...prev, category: serviceName }));
  // }, [serviceName]);

  const [filteredProviders, setFilteredProviders] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
    const results = searchServices(searchQuery, filters);
    setFilteredProviders(results);
    // console.log("results",results)
  }, [searchQuery, filters, services]);


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
  // console.log(filteredProviders)

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold capitalize">{serviceName} Providers</h1>
          <p className="text-gray-600">Search and filter the best service providers</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex flex-wrap gap-2 items-center justify-center mb-6">
          <div className="flex items-center border rounded px-3 py-2 bg-white w-full max-w-md">
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

        {/* Filters */}
        {showFilters && (
          <div className="bg-white shadow rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Location</label>
                <input
                  type="text"
                  placeholder="City or area"
                  value={filters.location}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Min Price</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Max Price</label>
                <input
                  type="number"
                  placeholder="1000"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((provider) => (
            <div key={provider.id} className="bg-white rounded-lg shadow p-4">
              <h3 className="text-xl font-semibold mb-1">{provider.title}</h3>
              <p className="text-gray-700 mb-1">{provider.description}</p>
              <p className="text-sm text-gray-600">Location: {provider.location}</p>
              <p className="text-sm text-gray-600">Price: ₹{provider.price}</p>
              <p className="text-sm text-gray-600">Rating: {provider.rating || "N/A"}</p>
            </div>
          ))}
        </div>

        {filteredProviders.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <h3 className="text-lg font-semibold">No providers found</h3>
            <p>Try adjusting your filters or search</p>
          </div>
        )}
      </div>
    </div>
  );
}
