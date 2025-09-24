import express from "express";
import { createEditShop, getMyShop, getShopByCity } from "../controllers/shop.controllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multer.js";

const shopRouter = express.Router();
// /api/shop
shopRouter.route("/create-edit").post(authMiddleware, upload.single("image"), createEditShop);
shopRouter.route("/get-my").get(authMiddleware, getMyShop);
shopRouter.route("/get-by-city/:city").get(authMiddleware, getShopByCity);

export default shopRouter;
