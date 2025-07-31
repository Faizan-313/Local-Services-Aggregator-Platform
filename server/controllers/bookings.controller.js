import db from "../database/db.js";

// Customer creates a booking
export const createBooking = async (req, res) => {
    const customerId = req.user.userId;
    const { listingId, booking_date } = req.body;

    if (!listingId || !booking_date) {
        return res.status(400).json({ message: "Missing listingId or booking_date" });
    }

    try {
        // Check if there’s already an booking for this listing on that date
        const [existing] = await db.query(
            `SELECT id FROM bookings 
                WHERE listing_id = ? AND booking_date = ? AND status IN ('pending','accepted')`,
            [listingId, booking_date]
        );

        if (existing.length > 0) {
            return res.status(409).json({ message: "This date is already booked or pending approval" });
        }

        // Insert booking with status pending
        await db.query(
            "INSERT INTO bookings (listing_id, customer_id, booking_date) VALUES (?, ?, ?)",
            [listingId, customerId, booking_date]
        );

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

        await db.query(
            "UPDATE bookings SET status = ?, updated_at = NOW() WHERE id = ?",
            [status, bookingId]
        );

        res.json({ message: `Booking status updated to ${status}` });
    } catch (error) {
        console.error("updateBookingStatus error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
