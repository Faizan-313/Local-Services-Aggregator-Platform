import { Router } from "express";
import protect from "../middlewares/auth.middleware.js";
import {
    createListing,
    getAllListings,
    getListingById
} from "../controllers/listings.controller.js";

const router = Router();

// Provider creates new listing
router.post("/listings", protect(["provider"]), createListing);

// List all listings (optional filters)
router.get("/listings", getAllListings);

// Get single listing by id
router.get("/listings/:id", getListingById);

export default router;
