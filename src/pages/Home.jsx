import { Link } from "react-router-dom"
import { useServices } from "../contexts/ServiceContext"
import { Search, Star, MapPin, Users } from "lucide-react"

function Home() {
  const { services, categories } = useServices()

  const featuredServices = services.slice(0, 3)

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Find Local Service Providers</h1>
          <p>Connect with trusted professionals in your area for all your service needs</p>
          <Link to="/services" className="cta-button">
            <Search className="icon" />
            Browse Services
          </Link>
        </div>
        <div className="hero-image">
          <img src="/placeholder.svg?height=400&width=600" alt="Local Services" />
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <h2>Popular Categories</h2>
        <div className="category-grid">
          {categories.slice(0, 6).map((category) => (
            <Link key={category} to={`/services?category=${category}`} className="category-card">
              <div className="category-icon">
                <img src={`/placeholder.svg?height=60&width=60&query=${category}`} alt={category} />
              </div>
              <h3>{category}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Services */}
      <section className="featured-services">
        <h2>Featured Services</h2>
        <div className="services-grid">
          {featuredServices.map((service) => (
            <div key={service.id} className="service-card">
              <img src={service.image || "/placeholder.svg"} alt={service.title} />
              <div className="service-info">
                <h3>{service.title}</h3>
                <p className="service-provider">{service.providerName}</p>
                <div className="service-meta">
                  <div className="rating">
                    <Star className="star-icon filled" />
                    <span>{service.rating}</span>
                  </div>
                  <div className="location">
                    <MapPin className="icon" />
                    <span>{service.location}</span>
                  </div>
                </div>
                <div className="service-price">${service.price}/hour</div>
                <Link to={`/service/${service.id}`} className="view-service-btn">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stat-item">
          <Users className="stat-icon" />
          <div className="stat-number">500+</div>
          <div className="stat-label">Service Providers</div>
        </div>
        <div className="stat-item">
          <Star className="stat-icon" />
          <div className="stat-number">1000+</div>
          <div className="stat-label">Happy Customers</div>
        </div>
        <div className="stat-item">
          <MapPin className="stat-icon" />
          <div className="stat-number">50+</div>
          <div className="stat-label">Cities Covered</div>
        </div>
      </section>
    </div>
  )
}

export default Home
