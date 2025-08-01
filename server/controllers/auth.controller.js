import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import db from "../database/db.js"
import dotenv from "dotenv"

dotenv.config()

const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
}

const JWT_SECRET = process.env.JWT_SECRET
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET
const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY
const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY

// Generate access token
const generateToken = (payload, expiresIn = accessTokenExpiry) =>
    jwt.sign(payload, JWT_SECRET, { expiresIn });

// Generate refresh token
const generateRefreshToken = (payload, expiresIn = refreshTokenExpiry) =>
    jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn });


// Register customer
export const registerCustomer = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        const [existing] = await db.query("SELECT id FROM users WHERE email = ?", 
        [email]);
        if (existing.length > 0) {
            return res.status(409).json({ error: "User already exists" });
        }

        const hash = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            "INSERT INTO  users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
            [name, email, hash, "customer"]
        );

        return res
        .status(201)
        .json({
            message: "Customer registered successfully",
            userId: result.insertId,
        });
    } catch (err) {
        console.error("Register customer error:", err);
        return res.status(500).json({ error: "Server error" });
    }
};


// Register provider (requires protect middleware to check role)
export const registerProvider = async (req, res) => {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        const [existing] = await db.query("SELECT id FROM users WHERE email = ?", 
        [email]);
        if (existing.length > 0) {
            return res.status(409).json({ error: "User already exists" });
        }

        const hash = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            "INSERT INTO users (name, email, password_hash, role, phone) VALUES (?, ?, ?, ?, ?)",
            [name, email, hash, "provider", phone || null]
        );

        return res
        .status(201)
        .json({
            message: "Provider registered successfully",
            userId: result.insertId,
        });
    } catch (err) {
        console.error("Register provider error:", err);
        return res.status(500).json({ error: "Server error" });
    }
};


// Login
export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: "Missing email or password" });

    try {
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", 
        [email]);
        if (rows.length === 0)
            return res.status(401).json({ error: "Invalid credentials" });

        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch)
            return res.status(401).json({ error: "Invalid credentials" });

        const accessToken = generateToken({ userId: user.id, role: user.role });
        const refreshToken = generateRefreshToken({
            userId: user.id,
            role: user.role,
        });

        await db.query("UPDATE users SET refresh_token = ? WHERE id = ?", [
            refreshToken,
            user.id,
        ]);

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                message: "User logged in successfully",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    created_at: user.created_at
                },
                accessToken,
                refreshToken
            });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ error: "Server error" });
    }
};


// Logout
export const logout = async (req, res) => {
    try {
        await db.query("UPDATE users SET refresh_token = NULL WHERE id = ?", 
        [req.user.userId]);
        return res.clearCookie( 'accessToken', options ).clearCookie( 'refreshToken', options ).json({ message: 'Logged out' });

    } catch (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ error: "Server error" });
    }
};



// Refresh token
export const refreshAccessToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!refreshToken) return res.status(400).json({ error: 'Missing refresh token' });

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE refresh_token = ?', [refreshToken]);
        if (rows.length === 0) return res.status(403).json({ error: 'Invalid refresh token' });

        const user = rows[0];
        jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, decoded) => {
            if (err) return res.status(403).json({ error: 'Invalid token' });

        const newAccessToken = generateToken({ userId: user.id, role: user.role });
        return res.json({ accessToken: newAccessToken });
        });
    } catch (err) {
        console.error('Refresh token error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
};