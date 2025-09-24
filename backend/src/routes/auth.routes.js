import express from "express"
import { googleAuth, resetPassword, sendOtp, signIn, signOut, signUp, verifyOtp } from "../controllers/auth.controllers.js"

const authRouter = express.Router()

// /api/auth
authRouter.route("/signup").post(signUp)
authRouter.route("/signin").post(signIn)
authRouter.route("/signout").get(signOut)
authRouter.route("/send-otp").post(sendOtp)
authRouter.route("/verify-otp").post(verifyOtp)
authRouter.route("/reset-password").post(resetPassword)
authRouter.route("/google-auth").post(googleAuth)

export default authRouter
