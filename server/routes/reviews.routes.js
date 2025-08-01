import { Router } from "express";
import protect from "../middlewares/auth.middleware.js";
import { addOrUpdateReview, getListingReviews, getProviderReviewsStats } from "../controllers/reviews.controller.js";

const router = Router();

// Customer adds or updates review
router.post("/reviews", protect(["customer"]), addOrUpdateReview);

// Get all reviews for a listing
router.get("/reviews/:listingId", getListingReviews);

//get all rewiews for provider
router.get("/reviews/provider", protect(['provider']), getProviderReviewsStats);


export default router;