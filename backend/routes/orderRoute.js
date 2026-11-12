
import express from "express";
import {
    listOrders,
    placeOrderRazorpay,
    updateStatus,
    userOrders,
    verifyRazorpay
} from "../controllers/orderController.js";

import authMiddleware from "../middleware/auth.js";

const orderRouter = express.Router();

orderRouter.post("/razorpay", authMiddleware, placeOrderRazorpay);

orderRouter.post("/verifyRazorpay", authMiddleware, verifyRazorpay);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.get("/list",listOrders)
orderRouter.post("/update",updateStatus)


export default orderRouter;
