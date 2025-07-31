
import { Search, Star, MapPin, Users, ArrowRight, Sparkles } from "lucide-react"
import React from "react"
import { Link } from "react-router-dom"

// Mock data for demonstration
const mockServices = [
  {
    id: 1,
    title: "Professional House Cleaning",
    providerName: "CleanPro Services",
    rating: 4.8,
    location: "Downtown",
    price: 25,
    image: "/placeholder.svg"
  },
  {
    id: 2,
    title: "Plumbing Repair",
    providerName: "QuickFix Plumbers",
    rating: 4.9,
    location: "Midtown",
    price: 45,
    image: "/placeholder.svg"
  },
  {
    id: 3,
    title: "Garden Maintenance",
    providerName: "Green Thumb Co.",
    rating: 4.7,
    location: "Suburbs",
    price: 30,
    image: "/placeholder.svg"
  }
]

const mockCategories = ["Cleaning", "Plumbing", "Electrical", "Gardening", "Painting", "Repairs"]

function Home() {
  const services = mockServices
  const categories = mockCategories
  
  const featuredServices = services.slice(0, 3)
  
  const handleNavigation = (path) => {
    console.log(`Navigate to: ${path}`)
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
                <Sparkles className="w-4 h-4 mr-2" />
                Trusted by 1000+ customers
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Find Local
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Service Providers
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-blue-100 max-w-2xl">
                Connect with trusted professionals in your area for all your service needs. Quality guaranteed.
              </p>
              {/* <button 
                onClick={() => handleNavigation('/services')}
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-2xl font-semibold text-lg hover:bg-blue-50 transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl group cursor-pointer"
              >
                <Search className="w-6 h-6 mr-3" />
                Browse Services
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button> */}
              <Link to="/services" className="cta-button">
            <Search className="icon" />
            Browse Services
          </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl transform rotate-6 opacity-20"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <img 
                  src="/placeholder.svg?height=400&width=600" 
                  alt="Local Services" 
                  className="w-full h-80 object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Popular Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the services you need across various categories
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.slice(0, 6).map((category) => (
              <button 
                key={category} 
                onClick={() => handleNavigation(`/services?category=${category}`)}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 hover:border-blue-200 cursor-pointer"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <img 
                    src={`/placeholder.svg?height=60&width=60&query=${category}`} 
                    alt={category} 
                    className="w-8 h-8"
                  />
                </div>
                <h3 className="text-center font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {category}
                </h3>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Featured Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Handpicked services from our top-rated providers
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <div 
                key={service.id} 
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={service.image || "/placeholder.svg"} 
                    alt={service.title} 
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                    ${service.price}/hr
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 font-medium">{service.providerName}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-semibold text-gray-900">{service.rating}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{service.location}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleNavigation(`/service/${service.id}`)}
                    className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-3 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center text-white group">
              <div className="w-20 h-20 mx-auto mb-6 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-10 h-10" />
              </div>
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-xl text-blue-100">Service Providers</div>
            </div>
            <div className="text-center text-white group">
              <div className="w-20 h-20 mx-auto mb-6 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Star className="w-10 h-10" />
              </div>
              <div className="text-5xl font-bold mb-2">1000+</div>
              <div className="text-xl text-blue-100">Happy Customers</div>
            </div>
            <div className="text-center text-white group">
              <div className="w-20 h-20 mx-auto mb-6 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="w-10 h-10" />
              </div>
              <div className="text-5xl font-bold mb-2">50+</div>
              <div className="text-xl text-blue-100">Cities Covered</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
