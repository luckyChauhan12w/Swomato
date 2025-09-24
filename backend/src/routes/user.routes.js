import express from "express";
import { getCurrentUser, updateUserLocation } from "../controllers/user.controllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const userRouter = express.Router();
// /api/user
userRouter.route("/current").get(authMiddleware, getCurrentUser);
userRouter.route("/update-location").post(authMiddleware, updateUserLocation);

export default userRouter;
