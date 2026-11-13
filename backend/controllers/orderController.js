
import "dotenv/config";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Razorpay from "razorpay";

const currency = "inr";

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. Place order using Razorpay
const placeOrderRazorpay = async (req, res,next) => {
    try {
        const { userId, items, amount, address } = req.body;
        if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
        success: false,
        message: "Order items are required"
    });
}
if (items.some(item =>
    !item._id ||
    !Number.isInteger(Number(item.quantity)) ||
    Number(item.quantity) <= 0
)) {
    return res.status(400).json({
        success: false,
        message: "Invalid order items"
    });
}

if (!address) {
    return res.status(400).json({
        success: false,
        message: "Delivery address is required"
    });
}
if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
    return res.status(400).json({
        success: false,
        message: "Invalid order amount"
    });
}

        const orderData = {
            userId,
            items,
            amount,
            address,
            payment: false,
            date: Date.now()
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const options = {
            amount: Math.round(amount * 100),
            currency: currency.toUpperCase(),
            receipt: newOrder._id.toString()
        };

        const order = await razorpayInstance.orders.create(options);

        res.json({
            success: true,
            order
        });

    } catch (error) {
         next(error);
    }
};

// 2. Verify Razorpay payment
const verifyRazorpay = async (req, res,next) => {
    try {
        const { userId, razorpay_order_id } = req.body;

        const orderInfo = await razorpayInstance.orders.fetch(
            razorpay_order_id
        );

        if (orderInfo.status === "paid") {

            await orderModel.findByIdAndUpdate(
                orderInfo.receipt,
                { payment: true }
            );

            await userModel.findByIdAndUpdate(userId, {
                cartData: {}
            });

            res.json({
                success: true,
                message: "Payment Successful"
            });

        } else {
            res.json({
                success: false,
                message: "Payment Failed"
            });
        }

    } catch (error) {
        next(error);
    }
};
//user orders for frontend
const userOrders=async(req,res,next)=>{
    try {
        const orders=await orderModel.find({userId:req.body.userId})
        res.json({success:true,data:orders})
    } catch (error) {
         next(error);
    }

}

//listing order for admin panel

const listOrders=async(req,res,next)=>{

    try {
        const orders=await orderModel.find({});
        res.json({success:true,data:orders})
    } catch (error) {
 next(error);    }

}

//api for updating orderstatus
const updateStatus=async(req,res,next)=>{
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
        res.json({success:true,message:"Status updated"})
        
    } catch (error) {
 next(error);    }

}

export {
    placeOrderRazorpay,
    verifyRazorpay,userOrders,listOrders,
    updateStatus
};
