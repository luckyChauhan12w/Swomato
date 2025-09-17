import express from "express"
import { googleAuth, signIn, signOut, signUp } from "../controllers/auth.controllers.js"

const authRoutes = express.Router()

// /api/v1/auth/login
authRoutes.post('/login', signIn)
authRoutes.post('/register', signUp)
authRoutes.post('/logout', signOut)
authRoutes.post('/google-auth', googleAuth)

export default authRoutes

