import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";
import mongoose from "mongoose";

//add items to user cart

const addToCart = async (req, res, next) => {
  try {
    if (!req.body.itemId) {
      return res.status(400).json({
        success: false,
        message: "Item ID is required",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(req.body.itemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid food item ID",
      });
    }
    const food = await foodModel.findById(req.body.itemId);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
      });
    }
    let userData = await userModel.findById(req.body.userId);
    if (!userData) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }
    let cartData = await userData.cartData;
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }
    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Added to cart" });
  } catch (error) {
    next(error);
  }
};

//removes items from user cart

const removeFromCart = async (req, res, next) => {
  try {
    if (!req.body.itemId) {
      return res.status(400).json({
        success: false,
        message: "Item ID is required",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(req.body.itemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid food item ID",
      });
    }
    const food = await foodModel.findById(req.body.itemId);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
      });
    }
    let userData = await userModel.findById(req.body.userId);
    if (!userData) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }
    let cartData = await userData.cartData;

    if (!cartData[req.body.itemId] || cartData[req.body.itemId] <= 0) {
      return res.status(400).json({
        success: false,
        message: "Item is not in cart",
      });
    }

    cartData[req.body.itemId] -= 1;
    if (cartData[req.body.itemId] === 0) {
    delete cartData[req.body.itemId];
}
    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "removed from card" });
  } catch (error) {
    next(error);
  }
};

//fetch user cart data

const getCart = async (req, res, next) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (!userData) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }
    let cartData = await userData.cartData;
    res.json({ success: true, cartData });
  } catch (error) {
    next(error);
  }
};
export { addToCart, removeFromCart, getCart };
