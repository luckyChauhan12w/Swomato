import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { addItem, deleteItem, editItem, getItemByCity, getItemById, getItemsByShop, rating, searchItems } from "../controllers/item.controllers.js";
import { upload } from "../middlewares/multer.js";

const itemRouter = express.Router();

// /api/item
itemRouter.route("/add-item").post(authMiddleware, upload.single("image"), addItem);
itemRouter.route("/edit-item/:itemId").post(authMiddleware, upload.single("image"), editItem);
itemRouter.route("/get-by-id/:itemId").get(authMiddleware, getItemById);
itemRouter.route("/delete/:itemId").get(authMiddleware, deleteItem);
itemRouter.route("/get-by-city/:city").get(authMiddleware, getItemByCity);
itemRouter.route("/get-by-shop/:shopId").get(authMiddleware, getItemsByShop);
itemRouter.route("/search-items").get(authMiddleware, searchItems);
itemRouter.route("/rating").post(authMiddleware, rating);

export default itemRouter;
