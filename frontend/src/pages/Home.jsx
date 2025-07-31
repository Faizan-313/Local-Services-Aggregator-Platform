"use client"
import React from "react"
import { Link } from "react-router-dom"
import { Users, ThumbsUp, CalendarCheck, Phone, Mail } from "lucide-react"

const featuredServices = [
  {
    id: 1,
    title: "Professional House Cleaning",
    image: "/cleaning.jpg"
  },
  {
    id: 2,
    title: "Certified Electrician",
    image: "/electrician.jpg"
  },
  {
    id: 3,
    title: "Home Plumbing Expert",
    image: "/plumber.jpg"
  },
  {
    id: 4,
    title: "Skilled Carpenter Services",
    image: "/carpenter.jpg"
  },
  {
    id: 5,
    title: "Experienced Home Tutor",
    image: "/tutor.jpg"
  },
]

function Home() {
  return (
    <div className="space-y-16 p-4 sm:p-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-100 to-white p-6 rounded-xl shadow-md text-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">
              Find Trusted Local Services Near You
            </h1>
            <p className="text-gray-600 text-lg">
              Book electricians, cleaners, plumbers, and more — anytime, anywhere.
            </p>
          </div>
          <img
            src="/mainpage.jpg"
            alt="Local Services"
            className="w-full h-80 object-cover rounded-2xl"
          />
        </div>
      </section>

      {/* Featured Services */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Featured Services
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredServices.map(service => (
            <div
              key={service.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-4 space-y-2 text-center">
                <h3 className="text-xl font-semibold">{service.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-gray-700">
        <div className="bg-indigo-50 p-6 rounded-xl shadow">
          <Users className="w-10 h-10 mx-auto text-indigo-500" />
          <p className="mt-2 text-lg font-semibold">10K+ Users</p>
        </div>
        <div className="bg-green-50 p-6 rounded-xl shadow">
          <ThumbsUp className="w-10 h-10 mx-auto text-green-500" />
          <p className="mt-2 text-lg font-semibold">4.8 Avg Rating</p>
        </div>
        <div className="bg-yellow-50 p-6 rounded-xl shadow">
          <CalendarCheck className="w-10 h-10 mx-auto text-yellow-500" />
          <p className="mt-2 text-lg font-semibold">5000+ Bookings</p>
        </div>
      </section>

      {/* About Us Section (Professionally Styled) */}
<section className="bg-white p-10 rounded-xl shadow-md border border-gray-200 text-gray-800">
  <h2 className="text-3xl font-extrabold text-center mb-4 text-indigo-600">About Us</h2>
  <p className="max-w-4xl mx-auto text-center text-lg leading-relaxed mb-8 text-gray-600">
    <strong>ThinkBit</strong> is a community-driven platform designed to connect customers with 
    trustworthy local service providers. Whether you need a plumber, electrician, or cleaner, 
    we’re committed to delivering quality, transparency, and ease — all in one place.
  </p>

  <div className="max-w-4xl mx-auto">
    <h3 className="text-2xl font-semibold text-center text-gray-700 mb-4">Meet Our Team</h3>
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 text-center">
      <div className="p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md">
        <p className="text-lg font-bold">Liyakat</p>
        <p className="text-sm text-gray-500">Team Leader & Backend Developer</p>
      </div>
      <div className="p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md">
        <p className="text-lg font-bold">Sajad</p>
        <p className="text-sm text-gray-500">Frontend Developer</p>
      </div>
      <div className="p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md">
        <p className="text-lg font-bold">Faizan</p>
        <p className="text-sm text-gray-500">Backend & Integration</p>
      </div>
      <div className="p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md">
        <p className="text-lg font-bold">Vishnu</p>
        <p className="text-sm text-gray-500">Dashboard Specialist</p>
      </div>
    </div>
  </div>
</section>

      {/* Footer - Contact Us */}
      <footer className="bg-gray-900 text-white py-8 px-6 rounded-xl shadow mt-10">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h3 className="text-xl font-bold text-indigo-400">Contact Us</h3>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-sm sm:text-base">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-indigo-300" />
              <span>+91-9000000432</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-300" />
              <span>support@thinkbit.in</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">© 2025 Think Bit. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home
