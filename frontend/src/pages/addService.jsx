"use client"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useServices } from "../contexts/ServiceContext"
import { useAuth } from "../contexts/AuthContext"

function AddService() {
    const { addService } = useServices()
    const { user } = useAuth()
    const navigate = useNavigate()

    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        city: "",
        serviceName: "",
        availability: [] 
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const categories = ['Electrician', 'Plumber', 'Tutor', 'Home Cleaning', 'Carpenter']

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleCheckboxChange = (day) => {
        setForm(prevForm => {
            const alreadySelected = prevForm.availability.includes(day)
            if (alreadySelected) {
                return { ...prevForm, availability: prevForm.availability.filter(d => d !== day) }
            } else {
                return { ...prevForm, availability: [...prevForm.availability, day] }
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const result = await addService({
                ...form,
                provider_id: user.id,
                provider_name: user.name,
                price: Number(form.price),
            })

            if (result.success) {
                navigate("/dashboard") 
            } else {
                setError(result.error || "Failed to add service")
            }
        } catch (err) {
            console.error(err)
            setError("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-xl shadow">
            <h1 className="text-2xl font-bold mb-4">Add New Service</h1>

            {error && <p className="text-red-500 mb-2">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded"
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded"
                ></textarea>

                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={form.price}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded"
                />

                <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={form.city}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded"
                />

                <select
                    name="serviceName"
                    value={form.serviceName}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded"
                >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <div>
                    <label className="block font-semibold mb-1">Availability (Select days):</label>
                    <div className="grid grid-cols-2 gap-2">
                        {weekDays.map(day => (
                            <label key={day} className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={form.availability.includes(day)}
                                    onChange={() => handleCheckboxChange(day)}
                                    className="mr-2"
                                />
                                {day}
                            </label>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    {loading ? "Adding..." : "Add Service"}
                </button>
            </form>
        </div>
    )
}

export default AddService
