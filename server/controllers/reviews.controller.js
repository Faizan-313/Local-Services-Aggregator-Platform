import db from "../database/db.js";

// Customer adds or updates review
export const addOrUpdateReview = async (req, res) => {
    const customerId = req.user.userId;
    const { listingId, rating, comment } = req.body;

    if (!listingId || !rating) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    try {
        const [listingRows] = await db.query("SELECT id FROM service_listings WHERE id = ?", [listingId]);
        if (listingRows.length === 0) {
            return res.status(404).json({ message: "Listing not found" });
        }

        const [existing] = await db.query(
            "SELECT id FROM reviews WHERE listing_id = ? AND customer_id = ?",
            [listingId, customerId]
        );

        if (existing.length > 0) {
            // Update existing review
            await db.query(
                "UPDATE reviews SET rating = ?, comment = ?, created_at = NOW() WHERE id = ?",
                [rating, comment, existing[0].id]
            );
            return res.json({ message: "Review updated successfully" });
        } else {
            await db.query(
                "INSERT INTO reviews (listing_id, customer_id, rating, comment) VALUES (?, ?, ?, ?)",
                [listingId, customerId, rating, comment]
            );
            return res.status(201).json({ message: "Review added successfully" });
        }

    } catch (error) {
        console.error("addOrUpdateReview error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all reviews for a listing
export const getListingReviews = async (req, res) => {
    const { listingId } = req.params;

    try {
        const [reviews] = await db.query(
            `SELECT r.id, r.rating, r.comment, r.created_at, u.name AS customer_name
                FROM reviews r
                JOIN users u ON r.customer_id = u.id
                WHERE r.listing_id = ?
                ORDER BY r.created_at DESC`,
            [listingId]
        );
        res.json(reviews);
    } catch (error) {
        console.error("getListingReviews error:", error);
        res.status(500).json({ message: "Server error" });
    }
};