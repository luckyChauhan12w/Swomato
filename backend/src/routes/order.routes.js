import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
    acceptOrder,
    getCurrentOrder,
    getDeliveryBoyAssignment,
    getMyOrders,
    getOrderById,
    getTodayDeliveries,
    placeOrder,
    sendDeliveryOtp,
    updateOrderStatus,
    verifyDeliveryOtp,
    verifyPayment
} from "../controllers/order.controllers.js";

const orderRouter = express.Router();

// /api/order
orderRouter.route("/place-order").post(authMiddleware, placeOrder);
orderRouter.route("/verify-payment").post(authMiddleware, verifyPayment);
orderRouter.route("/my-orders").get(authMiddleware, getMyOrders);
orderRouter.route("/get-assignments").get(authMiddleware, getDeliveryBoyAssignment);
orderRouter.route("/get-current-order").get(authMiddleware, getCurrentOrder);
orderRouter.route("/send-delivery-otp").post(authMiddleware, sendDeliveryOtp);
orderRouter.route("/verify-delivery-otp").post(authMiddleware, verifyDeliveryOtp);
orderRouter.route("/update-status/:orderId/:shopId").post(authMiddleware, updateOrderStatus);
orderRouter.route("/accept-order/:assignmentId").get(authMiddleware, acceptOrder);
orderRouter.route("/get-order-by-id/:orderId").get(authMiddleware, getOrderById);
orderRouter.route("/get-today-deliveries").get(authMiddleware, getTodayDeliveries);

export default orderRouter;
