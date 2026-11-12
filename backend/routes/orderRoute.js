
import express from "express";
import {
    placeOrderRazorpay,
    verifyRazorpay
} from "../controllers/orderController.js";

import authMiddleware from "../middleware/auth.js";

const orderRouter = express.Router();

orderRouter.post("/razorpay", authMiddleware, placeOrderRazorpay);

orderRouter.post("/verifyRazorpay", authMiddleware, verifyRazorpay);

export default orderRouter;
