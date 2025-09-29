import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

import authRouter from "./routes/auth.routes.js"
import userRouter from "./routes/user.routes.js"
import itemRouter from "./routes/product.routes.js"
import shopRouter from "./routes/shop.routes.js"
import orderRouter from "./routes/order.routes.js"
import path from "path"

const app = express()

// Middlewares
app.use(cors({
    origin: "https://swomato-frontend.onrender.com",
    credentials: true
}))


// SPA Fallback — serve index.html for all other routes
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.use(express.json())
app.use(cookieParser())

// Routes
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/shop", shopRouter)
app.use("/api/item", itemRouter)
app.use("/api/order", orderRouter)

export default app
