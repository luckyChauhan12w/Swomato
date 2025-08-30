import express from "express"
import { signIn, signOut, signUp } from "../controllers/auth.controllers.js"

const authRoutes = express.Router()

authRoutes.post('/signUp', signUp)
authRoutes.post('/signIn', signIn)
authRoutes.post('/signOut', signOut)

export default authRoutes

