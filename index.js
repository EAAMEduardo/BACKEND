const express = require("express")
const connectDB = require("./db")
const dotenv = require("dotenv")
const authRoutes = require("./routes/auth.routes")
const listingRouter = require("./routes/listing.routes")
const cookieParser = require("cookie-parser")
const cors = require("cors")
dotenv.config()



const app = express()

app.use(cors({
    origin: "https://mernbyeaam.app",
    credentials: true
}))
app.use(cookieParser())
app.use(express.json())
app.use(authRoutes)
app.use(listingRouter)




connectDB()



app.listen(4000, () => {
    console.log("---SERVER ON---")
})