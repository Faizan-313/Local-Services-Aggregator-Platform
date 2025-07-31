
"use client"
import React from "react"
import { Link } from "react-router-dom"
import {
  Wrench,
  BookOpen,
  ShowerHead,
  Dumbbell,
  Sparkles,
  Hammer,
  ShieldCheck
} from "lucide-react"

function Services() {
  const categories = [
    "Electrician",
    "Plumber",
    "Tutor",
    "Home Cleaning",
    "Fitness Trainer",
    "Carpenter"
  ]

  const getIconForCategory = (category) => {
    switch (category.toLowerCase()) {
      case "electrician":
        return <Wrench className="w-10 h-10 mb-3 text-blue-600" />
      case "tutor":
        return <BookOpen className="w-10 h-10 mb-3 text-green-600" />
      case "plumber":
        return <ShowerHead className="w-10 h-10 mb-3 text-indigo-600" />
      case "home cleaning":
        return <Sparkles className="w-10 h-10 mb-3 text-purple-600" />
      case "fitness trainer":
        return <Dumbbell className="w-10 h-10 mb-3 text-red-600" />
      case "carpenter":
        return <Hammer className="w-10 h-10 mb-3 text-yellow-600" />
      default:
        return <ShieldCheck className="w-10 h-10 mb-3 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Browse Service Categories</h1>
          <p className="text-gray-600">Click a category to explore service providers</p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {categories.map((category) => (
            <Link
              to={`/services/${category.toLowerCase()}`}
              key={category}
              className="bg-white w-64 p-6 rounded-xl shadow hover:shadow-lg transition-all flex flex-col items-center text-center"
            >
              {getIconForCategory(category)}
              <h3 className="text-lg font-semibold text-gray-800 capitalize">{category}</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}


export default Services

