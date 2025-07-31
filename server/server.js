import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import 'dotenv/config'
import db from "./database/db.js"

const app = express();
const port = process.env.PORT || 3000

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))


//routes
import authRoute from "./routes/auth.routes.js"
import listingRoute from "./routes/listings.routes.js"
import bookingRoute from "./routes/booking.routes.js"

app.use('/api/auth', authRoute)
app.use('/api', listingRoute)
app.use('/api',bookingRoute)

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})