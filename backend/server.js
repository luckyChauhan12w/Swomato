import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./src/db/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./src/routes/auth.routes.js";
import userRouter from "./src/routes/user.routes.js";
import itemRouter from "./src/routes/product.routes.js";
import shopRouter from "./src/routes/shop.routes.js";
import orderRouter from "./src/routes/order.routes.js";

import http from "http";
import { Server } from "socket.io";
import { socketHandler } from "./socket.js";


const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
        methods: ['POST', 'GET']
    }
})

app.set("io", io)



const port = process.env.PORT || 5000
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/shop", shopRouter)
app.use("/api/item", itemRouter)
app.use("/api/order", orderRouter)

socketHandler(io)

server.listen(port, () => {
    connectDb()
    console.log(`server started at ${port}`)
})

