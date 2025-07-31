import { Router } from "express";
import { login, logout, refreshAccessToken, registerProvider, registerCustomer } from "../controllers/auth.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = Router()

router.post("/register", registerCustomer)
router.post('/register-provider', registerProvider)

router.post("/login", login)
router.post('/logout', protect(['customer', 'provider']), logout)

router.post('/refresh-token', refreshAccessToken)

export default router

