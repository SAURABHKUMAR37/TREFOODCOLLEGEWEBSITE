
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
const placeOrderRazorpay = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

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
        res.json({
            success: false,
            message: error.message
        });
    }
};

// 2. Verify Razorpay payment
const verifyRazorpay = async (req, res) => {
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
        res.json({
            success: false,
            message: error.message
        });
    }
};
//user orders for frontend
const userOrders=async(req,res)=>{
    try {
        const orders=await orderModel.find({userId:req.body.userId})
        res.json({success:true,data:orders})
    } catch (error) {
        res.json({success:false,message:"error"})
    }

}

//listing order for admin panel

const listOrders=async(req,res)=>{

    try {
        const orders=await orderModel.find({});
        res.json({success:true,data:orders})
    } catch (error) {
        res.json({success:false,message:error})
    }

}

//api for updating orderstatus
const updateStatus=async(req,res)=>{
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
        res.json({success:true,message:"Status updated"})
        
    } catch (error) {
        res.json({success:false,message:error})
    }

}

export {
    placeOrderRazorpay,
    verifyRazorpay,userOrders,listOrders,
    updateStatus
};
