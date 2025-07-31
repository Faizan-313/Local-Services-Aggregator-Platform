# 🌟 Local Services Aggregator Platform

A modern web application to help users easily discover, book, and manage local services and empower service providers to showcase their offerings and handle customer bookings.

---

## ✨ Features

✅ **User Functionality**
- User registration and secure login (JWT-based authentication)
- Browse for local services by category
- View detailed service pages with descriptions pricing, reviews, and provider information
- Book services directly from the platform
- Customer dashboard to track upcoming and past bookings
- Notifications on booking status updates (pending, accepted, rejected)

✅ **Service Provider Functionality**
- Create and manage service listings with title, description, price, availibility and location
- Provider dashboard to view total services, average rating, total reviews, and recent bookings
- Accept or reject customer bookings directly from the dashboard
- Monitor and track pending and completed bookings

✅ **General Functionality**
- Secure JWT authentication for both customers and providers
- Role-based access control (customers vs providers)
- Updates on dashboards after booking status changes

---

## 🛠 Tech Stack

- **Frontend:** React.js, React Router, Context API, Tailwind CSS 
- **Backend:** Node.js, Express.js
- **Database:** MySQL 
- **Authentication:** JSON Web Tokens (JWT) with access and refresh tokens
- **Other:**
  - RESTful API design
  - Secure password storage using bcrypt
  - Custom middleware for authentication and authorization

---

## 📌 Project Highlights

- Customer and provider dashboards tailored to each user role
- Booking system with support for pending, accepted, and rejected states
- Role-protected routes to ensure proper access to features
- Clean and maintainable frontend structure with reusable components
- Server-side validation to prevent duplicate bookings on the same date

---



