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
        await db.query(
            "UPDATE reviews SET rating = ?, comment = ?, created_at = NOW() WHERE id = ?",
            [rating, comment, existing[0].id]
        );
        } else {
        await db.query(
            "INSERT INTO reviews (listing_id, customer_id, rating, comment) VALUES (?, ?, ?, ?)",
            [listingId, customerId, rating, comment]
        );
        }

        // Recalculate average rating
        const [avgResult] = await db.query(
        "SELECT AVG(rating) AS avg FROM reviews WHERE listing_id = ?",
        [listingId]
        );

        const average = parseFloat(avgResult[0].avg || 0).toFixed(1); // like 4.2

        //  Update average_rating in service_listings
        await db.query(
        "UPDATE service_listings SET average_rating = ? WHERE id = ?",
        [average, listingId]
        );

        return res.status(200).json({ message: "Review submitted", average_rating: average });
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
        // console.log(reviews)
        res.json(reviews);
    } catch (error) {
        console.error("getListingReviews error:", error);
        res.status(500).json({ message: "Server error" });
    }
};



export const getProviderReviewsStats = async (req, res) => {
    try {
        // console.log("this route is hit");
        const providerId = req.user.userId;
        const [rows] = await db.query(
            `SELECT COUNT(*) as totalReviews, AVG(r.rating) as avgRating
            FROM reviews r
            JOIN service_listings s ON r.listing_id = s.id
            WHERE s.provider_id = ?`,
            [providerId]
        );
        console.log("rows:", rows);
        res.json({
            totalReviews: rows[0].totalReviews || 0,
            avgRating: rows[0].avgRating || 0
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
