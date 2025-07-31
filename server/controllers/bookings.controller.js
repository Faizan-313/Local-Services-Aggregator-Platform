import db from "../database/db.js";
import { sendEmail } from "../utils/mailer.js";

// Customer creates a booking
export const createBooking = async (req, res) => {
    const customerId = req.user.userId;
    const { listingId, booking_date } = req.body;

    if (!listingId || !booking_date) {
        return res.status(400).json({ message: "Missing listingId or booking_date" });
    }

    try {
        // Check if there’s already a booking for this listing on that date
        const [existing] = await db.query(
            `SELECT id FROM bookings 
             WHERE listing_id = ? AND booking_date = ? AND status IN ('pending','accepted')`,
            [listingId, booking_date]
        );

        if (existing.length > 0) {
            return res.status(409).json({ message: "This date is already booked or pending approval" });
        }

        // Get provider's email, name & listing title
        const [[providerRow]] = await db.query(
            `SELECT u.email, u.name as provider_name, sl.title 
             FROM service_listings sl
             JOIN users u ON sl.provider_id = u.id
             WHERE sl.id = ?`,
            [listingId]
        );

        // Insert booking with status pending
        await db.query(
            "INSERT INTO bookings (listing_id, customer_id, booking_date) VALUES (?, ?, ?)",
            [listingId, customerId, booking_date]
        );

        // Send email to provider
        await sendEmail({
            to: providerRow.email,
            subject: "New Booking Request",
            text: `Hello ${providerRow.provider_name},

You have a new booking request for your listing: ${providerRow.title} on ${booking_date}.

Please login to accept or reject the booking.`,
            html: `<p>Hello <strong>${providerRow.provider_name}</strong>,</p>
                   <p>You have a new booking request for your listing: <strong>${providerRow.title}</strong> on <strong>${booking_date}</strong>.</p>
                   <p>Please login to accept or reject the booking.</p>`
        });

        res.status(201).json({ message: "Booking created and pending approval" });
    } catch (error) {
        console.error("createBooking error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Customer gets their own bookings
export const getMyBookings = async (req, res) => {
    const customerId = req.user.userId;

    try {
        const [rows] = await db.query(
            `SELECT b.*, sl.title, sl.city, sl.price, sl.id as listing_id
             FROM bookings b
             JOIN service_listings sl ON b.listing_id = sl.id
             WHERE b.customer_id = ? ORDER BY booking_date DESC`,
            [customerId]
        );

        res.json(rows);
    } catch (error) {
        console.error("getMyBookings error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Provider gets bookings for their own listings
export const getProviderBookings = async (req, res) => {
    const providerId = req.user.userId;

    try {
        const [rows] = await db.query(
            `SELECT b.*, sl.title, sl.city, sl.price, u.name as customer_name
             FROM bookings b
             JOIN service_listings sl ON b.listing_id = sl.id
             JOIN users u ON b.customer_id = u.id
             WHERE sl.provider_id = ? ORDER BY booking_date DESC`,
            [providerId]
        );

        res.json(rows);
    } catch (error) {
        console.error("getProviderBookings error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Provider updates booking status (accepted, rejected, cancelled)
export const updateBookingStatus = async (req, res) => {
    const providerId = req.user.userId;
    const bookingId = req.params.id;
    const { status } = req.body;

    const validStatuses = ["accepted", "rejected", "cancelled"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    try {
        // Check provider owns the listing
        const [rows] = await db.query(
            `SELECT b.id, sl.provider_id
             FROM bookings b
             JOIN service_listings sl ON b.listing_id = sl.id
             WHERE b.id = ?`,
            [bookingId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (rows[0].provider_id !== providerId) {
            return res.status(403).json({ message: "Forbidden: not your booking" });
        }

        // Update booking status
        await db.query(
            "UPDATE bookings SET status = ?, updated_at = NOW() WHERE id = ?",
            [status, bookingId]
        );

        // If accepted → notify customer
        if (status === "accepted") {
            const [[info]] = await db.query(
                `SELECT u.email, u.name as customer_name, sl.title, b.booking_date
                 FROM bookings b
                 JOIN service_listings sl ON b.listing_id = sl.id
                 JOIN users u ON b.customer_id = u.id
                 WHERE b.id = ?`,
                [bookingId]
            );

            await sendEmail({
                to: info.email,
                subject: "Your booking was accepted!",
                text: `Hello ${info.customer_name},

Good news! Your booking for "${info.title}" on ${info.booking_date} has been accepted by the provider.`,
                html: `<p>Hello <strong>${info.customer_name}</strong>,</p>
                       <p>Good news! Your booking for <strong>${info.title}</strong> on <strong>${info.booking_date}</strong> has been <span style="color:green"><strong>accepted</strong></span> by the provider.</p>`
            });
        }

        res.json({ message: `Booking status updated to ${status}` });
    } catch (error) {
        console.error("updateBookingStatus error:", error);
        res.status(500).json({ message: "Server error" });
    }
};