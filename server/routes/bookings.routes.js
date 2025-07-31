import { Router } from "express";
import protect from "../middlewares/auth.middleware.js";
import {
    createBooking,
    getMyBookings,
    getProviderBookings,
    updateBookingStatus
} from "../controllers/bookings.controller.js";

const router = Router();

// Customer creates booking
router.post("/bookings", protect(["customer"]), createBooking);

// Customer views their own bookings
router.get("/bookings/my", protect(["customer"]), getMyBookings);

// Provider views bookings on their listings
router.get("/bookings/provider", protect(["provider"]), getProviderBookings);

// Provider updates booking status
router.patch("/bookings/:id/status", protect(["provider"]), updateBookingStatus);

export default router;
