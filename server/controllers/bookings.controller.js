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
        // Check existing booking on same listing/date
        const [existing] = await db.query(
        `SELECT id, customer_id, status FROM bookings 
        WHERE listing_id = ? AND booking_date = ?`,
        [listingId, booking_date]
        );

        if (existing.length > 0) {
        const booking = existing[0];

        // If same customer & pending → just update timestamp
        if (booking.customer_id === customerId && booking.status === "pending") {
            await db.query(`UPDATE bookings SET updated_at = NOW() WHERE id = ?`, [booking.id]);
            return res.status(200).json({ message: "Booking updated (was already pending)" });
        }

        // If existing booking is rejected/cancelled → delete old one to allow new booking
        if (booking.status === "rejected" || booking.status === "cancelled") {
            await db.query(`DELETE FROM bookings WHERE id = ?`, [booking.id]);
            // continue below to insert new booking
        }
        
        // If accepted or pending by another customer → block
        else if (booking.status === "accepted" || booking.customer_id !== customerId) {
            return res.status(409).json({ message: "This date is already booked or pending approval" });
        }
        }

        // Insert new booking
        const [[providerRow]] = await db.query(
        `SELECT u.email, u.name as provider_name, sl.title 
        FROM service_listings sl
        JOIN users u ON sl.provider_id = u.id
        WHERE sl.id = ?`,
        [listingId]
        );

        await db.query(
        `INSERT INTO bookings (listing_id, customer_id, booking_date) VALUES (?, ?, ?)`,
        [listingId, customerId, booking_date]
        );

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
                WHERE sl.provider_id = ? 
                ORDER BY booking_date DESC`,
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
        `SELECT b.id, b.customer_id, b.booking_date, sl.title, sl.provider_id, u.email as customer_email, u.name as customer_name
                FROM bookings b
                JOIN service_listings sl ON b.listing_id = sl.id
                JOIN users u ON b.customer_id = u.id
                WHERE b.id = ?`,
        [bookingId]
        );

        if (rows.length === 0) {
        return res.status(404).json({ message: "Booking not found" });
        }

        const booking = rows[0];

        if (booking.provider_id !== providerId) {
        return res.status(403).json({ message: "Forbidden: not your booking" });
        }

        if (status === "rejected") {
        // delete the booking
        await db.query("DELETE FROM bookings WHERE id = ?", [bookingId]);
        } else {
        // update status
        await db.query(
            "UPDATE bookings SET status = ?, updated_at = NOW() WHERE id = ?",
            [status, bookingId]
        );
    }

        // Send email to customer
        await sendEmail({
        to: booking.customer_email,
        subject: `Your booking has been ${status}`,
        text: `Hello ${booking.customer_name},
    Your booking for "${booking.title}" on ${booking.booking_date} has been ${status} by the provider.`,
        html: `<p>Hello <strong>${booking.customer_name}</strong>,</p>
    <p>Your booking for <strong>${booking.title}</strong> on <strong>${booking.booking_date}</strong> has been <strong>${status}</strong> by the provider.</p>`,
        });

        res.json({
        message: `Booking ${
            status === "rejected"
            ? "rejected and removed"
            : "status updated to " + status
        }`,
        });
    } catch (error) {
        console.error("updateBookingStatus error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
