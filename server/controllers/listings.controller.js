import db from "../database/db.js";

// Provider creates a new listing
export const createListing = async (req, res) => {
    const providerId = req.user.userId; 
    const { title, description, price, city, serviceName, availability } = req.body;

    if (!title || !price || !city || !serviceName || !Array.isArray(availability)) {
        return res.status(400).json({ message: "Missing required fields or invalid availability format" });
    }

    const validDays = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
    for (const day of availability) {
        if (!validDays.includes(day.toLowerCase())) {
            return res.status(400).json({ message: `Invalid day in availability: ${day}` });
        }
    }

    try {
        const [serviceRows] = await db.query(
            "SELECT id FROM services WHERE name = ?",
            [serviceName]
        );
        if (serviceRows.length === 0) {
            return res.status(400).json({ message: "Invalid service name" });
        }
        const serviceId = serviceRows[0].id;

        // Create listing
        const [result] = await db.query(
            "INSERT INTO service_listings (provider_id, service_id, title, description, price, city) VALUES (?, ?, ?, ?, ?, ?)",
            [providerId, serviceId, title, description || null, price, city]
        );
        const listingId = result.insertId;

        // Insert availability slots
        for (const day of availability) {
            await db.query(
                "INSERT INTO availability_slots (listing_id, day_of_week) VALUES (?, ?)",
                [listingId, day.toLowerCase()]
            );
        }

        return res.status(201).json({ 
            message: "Listing created successfully", 
            listingId 
        });
    } catch (error) {
        console.error("Error creating listing:", error);
        return res.status(500).json({ message: "Server error" });
    }
};


// get all listings 
export const getAllListings = async (req, res) => {
    const { city, price_min, price_max, category } = req.query;

    let query = `
        SELECT l.*, s.name AS service_name 
        FROM service_listings l
        JOIN services s ON l.service_id = s.id
        WHERE 1
    `;
    const params = [];

    if (city) {
        query += " AND l.city = ?";
        params.push(city);
    }
    if (price_min) {
        query += " AND l.price >= ?";
        params.push(price_min);
    }
    if (price_max) {
        query += " AND l.price <= ?";
        params.push(price_max);
    }
    if (category) {
        query += " AND LOWER(s.name) = ?";
        params.push(category.toLowerCase());
    }

    try {
        const [rows] = await db.query(query, params);
        // console.log(rows)
        res.json(rows);
    } catch (error) {
        console.error("Get all listings error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

//  get listing by id
export const getListingById = async (req, res) => {
    const listingId = req.params.id;

    try {
        const [rows] = await db.query(
            `SELECT l.*, s.name AS service_name 
            FROM service_listings l
            JOIN services s ON l.service_id = s.id
            WHERE l.id = ?`,
            [listingId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Listing not found" });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error("Get listing by ID error:", error);
        res.status(500).json({ error: "Server error" });
    }
};
