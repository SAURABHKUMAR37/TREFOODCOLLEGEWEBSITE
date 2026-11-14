
import foodModel from "../models/foodModel.js";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "trefood" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

const addFood = async (req, res, next) => {
  try {
    const { name, description, price, category } = req.body;

    if (!name || !description || !price || !category || !req.file) {
      return res.status(400).json({
        success: false,
        message: "All fields and image are required",
      });
    }

    if (!Number.isFinite(Number(price)) || Number(price) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid positive number",
      });
    }

    const result = await uploadToCloudinary(req.file.buffer);

    const food = new foodModel({
      name,
      description,
      price: Number(price),
      category,
      image: result.secure_url,
      imagePublicId: result.public_id,
    });

    try {
      await food.save();
    } catch (error) {
      await cloudinary.uploader.destroy(result.public_id).catch(() => {});
      throw error;
    }

    return res.json({ success: true, message: "Food added" });
  } catch (error) {
    next(error);
  }
};

const listFood = async (req, res, next) => {
  try {
    const foods = await foodModel.find({});
    return res.status(200).json({ success: true, data: foods });
  } catch (error) {
    next(error);
  }
};

const removeFood = async (req, res, next) => {
  try {
    const { id } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid food ID is required",
      });
    }

    const food = await foodModel.findById(id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    await foodModel.findByIdAndDelete(id);

    if (food.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(food.imagePublicId);
      } catch (error) {
        console.error("Cloudinary deletion failed:", error.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Food removed successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updateFood = async (req, res, next) => {
  try {
    const { id, name, description, price, category } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid food ID is required",
      });
    }

    const food = await foodModel.findById(id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

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

    let newImage = null;

    if (req.file) {
      newImage = await uploadToCloudinary(req.file.buffer);
    }

    const oldPublicId = food.imagePublicId;

    food.name = name;
    food.description = description;
    food.price = Number(price);
    food.category = category;

    if (newImage) {
      food.image = newImage.secure_url;
      food.imagePublicId = newImage.public_id;
    }

    try {
      await food.save();
    } catch (error) {
      if (newImage) {
        await cloudinary.uploader.destroy(newImage.public_id).catch(() => {});
      }
      throw error;
    }

    if (newImage && oldPublicId) {
      await cloudinary.uploader.destroy(oldPublicId).catch((error) => {
        console.error("Old image deletion failed:", error.message);
      });
    }

    return res.status(200).json({
      success: true,
      message: "Food updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export { addFood, listFood, removeFood, updateFood };
