import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectdb from "./config/db.js"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes.js"
import cors from 'cors'

const app = express()
const port = process.env.PORT || 5000

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


app.use(express.json())
app.use(cookieParser())

app.use('/api/v1/auth', authRoutes);

app.listen(port, () => {
    connectdb();
    console.log(`server is started at ${port}`);
});

