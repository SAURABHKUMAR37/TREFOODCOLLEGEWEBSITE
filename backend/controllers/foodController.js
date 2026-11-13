import foodModel from "../models/foodModel.js";
import mongoose from "mongoose";

import fs from "fs";

const addFood = async (req, res, next) => {
  const { name, description, price, category } = req.body;

  if (!name || !description || !price || !category || !req.file) {
    return res.status(400).json({
      success: false,
      message: "All fields and image are required",
    });
  }

  if (Number(price) <= 0 || !Number.isFinite(Number(price))) {
    return res.status(400).json({
      success: false,
      message: "Price must be a valid positive number",
    });
  }

  let image_filename = `${req.file.filename}`;

  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });
  try {
    await food.save();
    res.json({ success: true, message: "food added" });
  } catch (error) {
    next(error);
  }
};

const listFood = async (req, res, next) => {
  try {
    const foods = await foodModel.find({});
    res.status(200).json({
      success: true,
      data: foods,
    });
  } catch (error) {
    next(error);
  }
};

const removeFood = async (req, res, next) => {
  try {
    if (!req.body.id) {
      return res.status(400).json({
        success: false,
        message: "Food ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.body.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid food ID",
      });
    }
    const food = await foodModel.findById(req.body.id);
    if (!food) {
      const error = new Error("Food not found");
      error.statusCode = 404;
      return next(error);
    }
    await foodModel.findByIdAndDelete(req.body.id);
    fs.unlink(`uploads/${food.image}`, (error) => {
      if (error) {
        console.error("Image deletion failed:", error.message);
      }
    });

    res.status(200).json({
      success: true,
      message: "Food removed successfully",
    });
  } catch (error) {
    next(error);
  }
};
const updateFood = async (req, res, next) => {
  try {
    if (!req.body.id) {
      return res.status(400).json({
        success: false,
        message: "Food ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.body.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid food ID",
      });
    }
    const food = await foodModel.findById(req.body.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }
    const { name, description, price, category } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "All food fields are required",
      });
    }

    if (!Number.isFinite(Number(price)) || Number(price) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be greater than zero",
      });
    }
    food.name = name;
    food.description = description;
    food.price = Number(price);
    food.category = category;

    if (req.file) {
      food.image = req.file.filename;
    }

    await food.save();
    return res.status(200).json({
    success: true,
    message: "Food updated successfully"
});
  } catch (error) {
    next(error);
  }
};
export { addFood, listFood, removeFood, updateFood };
